import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: 'dkxuf7w3l',
      api_key: '881279623499269',
      api_secret: 'JbmSr9TKkrNBIiu9TvMjr6zSVU0',
    });
  }

  async uploadImage(file: string, folder: string): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder,
      });
      return result.secure_url;
    } catch (error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }
}
