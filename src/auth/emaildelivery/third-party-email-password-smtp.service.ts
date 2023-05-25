import { SMTPServiceConfig } from 'supertokens-node/lib/build/ingredients/emaildelivery/services/smtp';
import { TypeEmailPasswordPasswordResetEmailDeliveryInput } from 'supertokens-node/lib/build/recipe/emailpassword/types';
import { SMTPService } from 'supertokens-node/recipe/thirdpartyemailpassword/emaildelivery';
import { EmailDeliverViewService } from './email-deliverty-view.service';

type ReserPasswordInput = TypeEmailPasswordPasswordResetEmailDeliveryInput & {
  userContext: any;
};

export class ThirdPartyEmailPasswordSMTPService extends SMTPService {
  private readonly viewService: EmailDeliverViewService<ReserPasswordInput>;

  constructor(
    smtpSettings: SMTPServiceConfig,
    templateFile = 'reset-password.mjml',
  ) {
    super({
      smtpSettings,
      override: (originalImplementation) => {
        return {
          ...originalImplementation,
          getContent: async (input: ReserPasswordInput) => {
            const originalContent = await originalImplementation.getContent(
              input,
            );

            // originalContent.subject = 'My custom subject';
            originalContent.body = this.viewService.getContentBody(input);

            return originalContent;
          },
        };
      },
    });

    this.viewService = new EmailDeliverViewService(templateFile);
  }
}
