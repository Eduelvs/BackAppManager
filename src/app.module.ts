import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createObserveModule } from '@nestjs/observe';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { buildTypeOrmOptions } from './database/typeorm.config.js';
import { PlanoAnoMesesModule } from './plano-ano-meses/plano-ano-meses.module.js';
import { PlanoAnosModule } from './plano-anos/plano-anos.module.js';
import { PlanosModule } from './planos/planos.module.js';
import { UsersModule } from './users/users.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        ...buildTypeOrmOptions(process.env),
        autoLoadEntities: true,
      }),
    }),
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'back-app',
    }),
    UsersModule,
    AuthModule,
    PlanosModule,
    PlanoAnosModule,
    PlanoAnoMesesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
