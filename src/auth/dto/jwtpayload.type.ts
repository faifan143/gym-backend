import { Role } from '@prisma/client';

export interface JsonPayload {
  id: number;
  email: string;
  role: Role;
}
