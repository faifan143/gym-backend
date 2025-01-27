import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/role.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { JsonPayload } from 'src/auth/dto/jwtpayload.type';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { TrainerService } from './trainer.service';
import { Response } from 'express';

@Controller('trainer')
@UseGuards(AuthGuard, RoleGuard)
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Post('class')
  @Roles(Role.TRAINER)
  async createClass(@Body() data: CreateClassDto, @User() user: JsonPayload) {
    return this.trainerService.createClass(user.id, data);
  }

  @Get('classes')
  @Roles(Role.TRAINER)
  async getAllClasses(@User() user: JsonPayload) {
    return this.trainerService.getAllClasses(user.id);
  }

  @Get('class/:classId')
  @Roles(Role.TRAINER)
  async findOne(@User() user: JsonPayload, @Param('classId') classId: string) {
    return this.trainerService.findOne(user.id, classId);
  }

  @Get('class/:classId/customers')
  @Roles(Role.TRAINER)
  async getClassCustomers(
    @User() user: JsonPayload,
    @Param('classId') classId: string,
  ) {
    return this.trainerService.getClassCustomers(user.id, classId);
  }

  @Put('class/:classId')
  @Roles(Role.TRAINER)
  async updateClass(
    @User() user: JsonPayload,
    @Param('classId') classId: string,
    @Body() data: UpdateClassDto,
  ) {
    return this.trainerService.updateClass(user.id, classId, data);
  }

  @Delete('class/:classId')
  @Roles(Role.TRAINER)
  async deleteClass(
    @User() user: JsonPayload,
    @Param('classId') classId: string,
  ) {
    return this.trainerService.deleteClass(user.id, classId);
  }

  @Delete('class/:classId/customer/:customerId')
  @Roles(Role.TRAINER)
  async removeCustomerFromClass(
    @User() user: JsonPayload,
    @Param('classId') classId: string,
    @Param('customerId') customerId: string,
  ) {
    return this.trainerService.removeCustomerFromClass(
      user.id,
      parseInt(classId),
      parseInt(customerId),
    );
  }

  @Get('class/:classId/attendance/:scheduleId')
  @Roles(Role.TRAINER)
  async getScheduleAttendance(
    @User() user: JsonPayload,
    @Param('classId') classId: string,
    @Param('scheduleId') scheduleId: string,
  ) {
    return this.trainerService.getClassScheduleAttendance(
      user.id,
      parseInt(classId),
      scheduleId,
    );
  }
  @Get('class/:classId/attendance')
  @Roles(Role.TRAINER)
  async getClassAttendance(
    @User() user: JsonPayload,
    @Param('classId') classId: string,
  ) {
    return this.trainerService.getClassAttendance(user.id, parseInt(classId));
  }

  @Get('class/:classId/attendance/excel')
  async getClassAttendanceExcel(
    @Param('classId') classId: number,
    @User() user: JsonPayload,
    @Res() res: Response,
  ) {
    return this.trainerService.getClassAttendanceExcel(user.id, classId, res);
  }

  @Post('class/:classId/attendance/:scheduleId/customerId/:customerId')
  @Roles(Role.TRAINER)
  async markAttendance(
    @User() user: JsonPayload,
    @Param('classId') classId: string,
    @Param('scheduleId') scheduleId: string,
    @Param('customerId') customerId: string,
  ) {
    return this.trainerService.markCustomerAttendance(
      user.id,
      parseInt(classId),
      scheduleId,
      parseInt(customerId),
    );
  }
}
