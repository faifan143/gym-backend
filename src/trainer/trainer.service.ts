import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import * as XLSX from 'xlsx';
import { Response } from 'express';

@Injectable()
export class TrainerService {
  constructor(private readonly prisma: PrismaService) {}

  async createClass(trainerId: number, data: CreateClassDto) {
    const schedule = data.schedule.map((item) => ({
      day: item.day,
      time: item.time,
    }));

    const trainer = await this.prisma.trainer.findUnique({
      where: { userId: trainerId },
    });

    if (!trainer) {
      throw new BadRequestException(
        `Trainer with user id ${trainerId} does not exist.`,
      );
    }

    return this.prisma.class.create({
      data: {
        name: data.name,
        schedule,
        maxCapacity: data.capacity,
        trainerId: trainer.id,
      },
    });
  }

  async getAllClasses(trainerId: number) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { userId: trainerId },
    });

    if (!trainer) {
      throw new BadRequestException(
        `Trainer with user id ${trainerId} does not exist.`,
      );
    }
    return this.prisma.class.findMany({
      where: { trainerId: trainer.id },
      include: {
        customers: {
          include: {
            customer: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(trainerId: number, classId: string) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { userId: trainerId },
    });

    if (!trainer) {
      throw new BadRequestException(
        `Trainer with user id ${trainerId} does not exist.`,
      );
    }
    const classEntity = await this.prisma.class.findUnique({
      where: { id: parseInt(classId) },
    });

    if (!classEntity || classEntity.trainerId !== trainer.id) {
      throw new ForbiddenException(`You do not have access to this class.`);
    }

    return classEntity;
  }

  async getClassCustomers(trainerId: number, classId: string) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { userId: trainerId },
    });

    if (!trainer) {
      throw new BadRequestException(
        `Trainer with user id ${trainerId} does not exist.`,
      );
    }
    const classEntity = await this.prisma.class.findUnique({
      where: { id: parseInt(classId) },
      include: {
        customers: {
          include: {
            customer: {
              include: {
                user: true,
                attendedClasses: true,
                subscriptions: true,
              },
            },
          },
        },
      },
    });

    if (!classEntity || classEntity.trainerId !== trainer.id) {
      throw new ForbiddenException(`You do not have access to this class.`);
    }

    return classEntity.customers.map((customer) => customer.customer);
  }

  async updateClass(trainerId: number, classId: string, data: UpdateClassDto) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { userId: trainerId },
    });

    if (!trainer) {
      throw new BadRequestException(
        `Trainer with user id ${trainerId} does not exist.`,
      );
    }
    const classEntity = await this.prisma.class.findUnique({
      where: { id: parseInt(classId) },
    });

    if (!classEntity || classEntity.trainerId !== trainer.id) {
      throw new ForbiddenException(`You do not have access to this class.`);
    }

    return this.prisma.class.update({
      where: { id: parseInt(classId) },
      data,
    });
  }

  async deleteClass(trainerId: number, classId: string) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { userId: trainerId },
    });

    if (!trainer) {
      throw new BadRequestException(
        `Trainer with user id ${trainerId} does not exist.`,
      );
    }
    const classEntity = await this.prisma.class.findUnique({
      where: { id: parseInt(classId) },
    });

    if (!classEntity || classEntity.trainerId !== trainer.id) {
      throw new ForbiddenException(`You do not have access to this class.`);
    }

    return this.prisma.class.delete({
      where: { id: parseInt(classId) },
    });
  }

  async removeCustomerFromClass(
    trainerId: number,
    classId: number,
    customerId: number,
  ) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { userId: trainerId },
    });

    if (!trainer) {
      throw new BadRequestException(
        `Trainer with user id ${trainerId} does not exist.`,
      );
    }
    const classEntity = await this.prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classEntity || classEntity.trainerId !== trainer.id) {
      throw new ForbiddenException('You do not have access to this class.');
    }

    await this.prisma.customerClass.deleteMany({
      where: {
        classId: classId,
        customerId: customerId,
      },
    });

    return { message: `Customer ${customerId} removed from class ${classId}` };
  }

  async getClassScheduleAttendance(
    trainerId: number,
    classId: number,
    scheduleId: string,
  ) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { userId: trainerId },
    });
    if (!trainer) {
      throw new BadRequestException(
        `Trainer with user id ${trainerId} does not exist.`,
      );
    }

    // Get current week's start (Saturday) and end (Friday) dates
    const now = new Date();
    const currentDay = now.getDay();
    // JavaScript's getDay(): 0 is Sunday, we want 6 to be Saturday
    // So we subtract from 6 to get days to last Saturday
    const daysToLastSaturday = (currentDay + 1) % 7;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysToLastSaturday);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Verify trainer owns the class
    const classEntity = await this.prisma.class.findUnique({
      where: { id: classId },
      include: { customers: true },
    });
    if (!classEntity || classEntity.trainerId !== trainer.id) {
      throw new ForbiddenException('You do not have access to this class.');
    }

    // Verify the schedule exists
    const schedule = classEntity.schedule as Array<{
      day: string;
      time: string;
    }>;
    const isValidSchedule = schedule.some(
      (entry) => `${entry.day}_${entry.time}` === scheduleId,
    );
    if (!isValidSchedule) {
      throw new BadRequestException('Invalid schedule entry.');
    }

    // Fetch attendance for this schedule within current week
    const attendance = await this.prisma.attendance.findMany({
      where: {
        classId,
        scheduleId,
        attendedAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      include: {
        customer: {
          include: {
            Attendance: true,
          },
        },
      },
    });

    return {
      attendance,
      scheduleId,
      scheduleDetails: schedule.find(
        (entry) => `${entry.day}_${entry.time}` === scheduleId,
      ),
      customers: classEntity.customers.map((customer) => {
        const attendanceRecord = attendance.find(
          (att) => att.customerId === customer.customerId,
        );
        return {
          ...customer,
          isAttended: !!attendanceRecord,
          attendedAt: attendanceRecord ? attendanceRecord.attendedAt : null,
        };
      }),
      weekRange: {
        start: weekStart,
        end: weekEnd,
      },
    };
  }

  async getClassAttendance(trainerId: number, classId: number) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { userId: trainerId },
    });
    if (!trainer) {
      throw new BadRequestException(
        `Trainer with user id ${trainerId} does not exist.`,
      );
    }

    // Verify trainer owns the class
    const classEntity = await this.prisma.class.findUnique({
      where: { id: classId },
      include: { customers: true },
    });
    if (!classEntity || classEntity.trainerId !== trainer.id) {
      throw new ForbiddenException('You do not have access to this class.');
    }

    // Fetch attendance for this schedule within current week
    const attendance = await this.prisma.attendance.findMany({
      where: {
        classId,
      },
      include: {
        customer: {
          include: {
            Attendance: true,
          },
        },
      },
    });

    return attendance;
  }
  async markCustomerAttendance(
    trainerId: number,
    classId: number,
    scheduleId: string,
    customerId: number,
  ) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { userId: trainerId },
    });

    if (!trainer) {
      throw new BadRequestException(
        `Trainer with user id ${trainerId} does not exist.`,
      );
    }

    // Verify trainer owns the class
    const classEntity = await this.prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classEntity || classEntity.trainerId !== trainer.id) {
      throw new ForbiddenException('You do not have access to this class.');
    }

    const enrollment = await this.prisma.customerClass.findUnique({
      where: {
        customerId_classId: {
          customerId: customerId,
          classId: classId,
        },
      },
    });

    if (!enrollment) {
      throw new BadRequestException(
        `Customer ${customerId} is not enrolled in class ${classId}.`,
      );
    }

    return this.prisma.attendance.create({
      data: {
        classId,
        customerId,
        scheduleId,
      },
    });
  }

  async getClassAttendanceExcel(
    trainerId: number,
    classId: number,
    res: Response,
  ) {
    const XLSX = require('xlsx');

    // Sample data
    const data = [
      {
        id: 16,
        customerId: 42,
        classId: 11,
        scheduleId: 'الأحد_10:00',
        attendedAt: '2025-01-11T13:13:35.585Z',
        customer: {
          id: 42,
          userId: 67,
          createdAt: '2025-01-27T14:41:07.996Z',
          updatedAt: '2025-01-27T14:41:07.996Z',
          Attendance: [
            {
              id: 16,
              customerId: 42,
              classId: 11,
              scheduleId: 'الأحد_10:00',
              attendedAt: '2025-01-11T13:13:35.585Z',
            },
          ],
        },
      },
      {
        id: 17,
        customerId: 44,
        classId: 11,
        scheduleId: 'الثلاثاء_10:00',
        attendedAt: '2025-01-11T13:13:39.253Z',
        customer: {
          id: 44,
          userId: 65,
          createdAt: '2025-01-27T14:41:07.996Z',
          updatedAt: '2025-01-27T14:41:07.996Z',
          Attendance: [
            {
              id: 17,
              customerId: 44,
              classId: 11,
              scheduleId: 'الثلاثاء_10:00',
              attendedAt: '2025-01-11T13:13:39.253Z',
            },
          ],
        },
      },
      {
        id: 18,
        customerId: 48,
        classId: 11,
        scheduleId: 'الخميس_10:00',
        attendedAt: '2025-01-11T13:13:43.008Z',
        customer: {
          id: 48,
          userId: 64,
          createdAt: '2025-01-27T14:41:07.997Z',
          updatedAt: '2025-01-27T14:41:07.997Z',
          Attendance: [
            {
              id: 18,
              customerId: 48,
              classId: 11,
              scheduleId: 'الخميس_10:00',
              attendedAt: '2025-01-11T13:13:43.008Z',
            },
          ],
        },
      },
    ];

    // Transform data for Excel
    const attendanceData = data.map((entry) => ({
      CustomerId: entry.customerId,
      ScheduleId: entry.scheduleId,
      AttendedAt: entry.attendedAt,
    }));

    // Create a new workbook
    const ws = XLSX.utils.json_to_sheet(attendanceData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');

    // Write the workbook to a file
    XLSX.writeFile(wb, 'Attendance.xlsx');

    console.log('Excel file created: Attendance.xlsx');
  }
}
