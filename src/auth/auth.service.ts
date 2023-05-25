import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { ConfigInjectionToken, AuthModuleConfig } from './config.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConfigInjectionToken) private readonly config: AuthModuleConfig,
  ) {
    const { connectionURI, apiKey, ...rest } = this.config;
    supertokens.init({
      ...rest,
      supertokens: {
        connectionURI,
        apiKey,
      },
    });
  }

  signInWithEmailPassword(email: string, password: string, userContext?: any) {
    return EmailPassword.signIn(email, password, userContext);
  }

  signUpWithEmailPassword(email: string, password: string, userContext?: any) {
    return EmailPassword.signUp(email, password, userContext);
  }
}
