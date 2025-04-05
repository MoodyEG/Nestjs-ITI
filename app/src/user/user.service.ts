/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { IsNotEmpty, MinLength } from 'class-validator';
import * as jwt from 'jsonwebtoken';

export class User {
  id: number;

  @ApiProperty()
  @MinLength(4)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}

@Injectable()
export class UserService {
  private users: User[] = [];

  async signUp(name: string, password: string): Promise<string> {
    name = name.trim().toLowerCase();
    if (this.users.find((u) => u.name === name))
      throw new ConflictException('User already exists');

    const newId =
      this.users.length === 0
        ? 1
        : Math.max(...this.users.map((s) => s.id)) + 1;

    const hashedPassword = await bcrypt.hash(password, 8);

    this.users.push({ name, password: hashedPassword, id: newId });

    return 'User signed up successfully';
  }

  async signIn(
    name: string,
    password: string,
  ): Promise<{ name: string; token: string }> {
    const user = this.users.find((u) => u.name === name);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { id: user.id, name: user.name };

    const token = jwt.sign(payload, process.env.JWT_SECRET! ?? 'secret');

    return { name: user.name, token };
  }

  protectedRoute() {
    return 'This is a protected route, and you are authorized to access it';
  }
}
