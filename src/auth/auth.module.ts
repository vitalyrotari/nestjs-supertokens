import {
  ConfigurableModuleBuilder,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { ConfigInjectionToken, AuthModuleConfig } from './config.interface';
import { AuthService } from './auth.service';
import { AuthMiddleware } from './auth.middleware';

const { ConfigurableModuleClass } =
  new ConfigurableModuleBuilder<AuthModuleConfig>({
    moduleName: 'Auth',
    optionsInjectionToken: ConfigInjectionToken,
  })
    .setClassMethodName('forRoot')
    .build();

@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule extends ConfigurableModuleClass {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
