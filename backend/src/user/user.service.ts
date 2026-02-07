import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // 🔹 Create user (used by register)
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  // 🔹 Find user by email (used by login)
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
    });
  }

  // 🔹 Optional: keep admin creator
  async createAdmin(): Promise<User> {
    const admin = this.userRepo.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123', // ⚠️ hash later
      role: Role.ADMIN,
    });

    return this.userRepo.save(admin);
  }
}
