import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import Session from 'supertokens-node/recipe/session';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import ThirdPartyEmailPasswordNode, {
  Google,
  // Apple,
} from 'supertokens-node/recipe/thirdpartyemailpassword';
import { EmailVerificationSMTPService } from './auth/emaildelivery/email-verification-smtp.service';
import { ThirdPartyEmailPasswordSMTPService } from './auth/emaildelivery/third-party-email-password-smtp.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import aithConfig from './config/auth.config';
import smtpConfig from './config/smtp.config';
import { AuthModuleConfig } from './auth/config.interface';
import { SMTPConfig } from './common/interfaces/smtp-config.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [aithConfig, smtpConfig],
    }),
    LoggerModule.forRootAsync({
      useFactory() {
        return {
          pinoHttp: {
            transport: { target: 'pino-pretty' },
            redact: {
              paths: ['req.headers.cookie', 'res.headers["set-cookie"]'],
              remove: true,
            },
          },
        };
      },
    }),
    AuthModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const { connectionURI, apiKey, appInfo } =
          configService.get<AuthModuleConfig>('supertokens');

        const {
          host,
          port,
          password,
          user: authUsername,
        } = configService.get<SMTPConfig>('smtp');

        const smtpSettings = {
          host,
          port,
          authUsername,
          password,
          from: {
            name: 'Panther Loyalty',
            email: 'noreply@example.com',
          },
        };

        return {
          connectionURI,
          apiKey,
          appInfo,
          telemetry: false,
          recipeList: [
            EmailVerification.init({
              mode: 'REQUIRED',
              emailDelivery: {
                service: new EmailVerificationSMTPService(smtpSettings),
              },
            }),
            ThirdPartyEmailPasswordNode.init({
              providers: [
                Google({
                  clientId: process.env.GOOGLE_CLIENT_ID,
                  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                }),
                // Apple({
                //   clientId: process.env.APPLE_CLIENT_ID,
                //   clientSecret: {
                //     keyId: process.env.APPLE_KEY_ID,
                //     privateKey: process.env.APPLE_PRIVATE_KEY,
                //     teamId: process.env.APPLE_TEAM_ID,
                //   },
                // }),
              ],
              emailDelivery: {
                service: new ThirdPartyEmailPasswordSMTPService(smtpSettings),
              },
            }),
            Session.init(),
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
