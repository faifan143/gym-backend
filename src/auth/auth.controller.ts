import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { User } from './decorators/user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/shared/cloudinary.service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

// Create uploads directory if it doesn't exist
const uploadsDir = join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
export const storage = diskStorage({
  destination: uploadsDir,
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return await this.authService.handleLogin(credentials);
  }

  @Post('register')
  async registerUser(@Body() data: RegisterCustomerDto) {
    return this.authService.registerUser(data);
  }

  @Patch('update-name')
  @UseGuards(AuthGuard)
  async updateUserName(@Body('newName') newName: string, @User() user: any) {
    return this.authService.updateUserName(user.id, newName);
  }
  @Patch('update-photo')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: storage,
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async updatePhoto(
    @UploadedFile() file: Express.Multer.File,
    @User() user: any,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const cloudinary = new CloudinaryService();
    try {
      // Get the full path of the saved file
      const filePath = file.path;

      // Upload to Cloudinary
      const imageUrl = await cloudinary.uploadImage(filePath, 'photos');

      // Delete the local file after successful upload
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting local file:', err);
        }
      });

      return this.authService.updatePhoto(user.id, imageUrl);
    } catch (error) {
      // Clean up the local file in case of error
      if (file.path) {
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error('Error deleting local file:', err);
          }
        });
      }
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }

  @Patch('update-password')
  @UseGuards(AuthGuard)
  async updateUserPassword(
    @User() user: any,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.updateUserPassword(
      user.id,
      oldPassword,
      newPassword,
    );
  }
}
