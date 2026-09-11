import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email.toLowerCase());
    if (existing) {
      throw new ConflictException('Já existe uma conta com este email.');
    }

    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create(dto.email, password);
    return this.buildAuthResponse(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos.');
    }

    const matches = await bcrypt.compare(dto.password, user.password);
    if (!matches) {
      throw new UnauthorizedException('Email ou senha inválidos.');
    }

    return this.buildAuthResponse(user.id, user.email);
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }
    return { id: user.id, email: user.email };
  }

  private async buildAuthResponse(id: string, email: string) {
    const access_token = await this.jwtService.signAsync({
      sub: id,
      email,
    });
    return {
      access_token,
      user: { id, email },
    };
  }
}
