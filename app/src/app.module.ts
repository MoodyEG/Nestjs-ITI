import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { SchoolModule } from './school/school.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { HeadCheckMiddleware } from './middlewares/headcheck.middleware';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    EmployeeModule,
    SchoolModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        return {
          uri: process.env.MONGODB_URI,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/schools');
    consumer.apply(AuthMiddleware).forRoutes('/user/protected');
    consumer
      .apply(HeadCheckMiddleware)
      .forRoutes({ path: '/custom-header', method: RequestMethod.POST });
  }
}
