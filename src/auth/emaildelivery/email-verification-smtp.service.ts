import { SMTPServiceConfig } from 'supertokens-node/lib/build/ingredients/emaildelivery/services/smtp';
import { SMTPService } from 'supertokens-node/recipe/emailverification/emaildelivery';
import { EmailDeliverViewService } from './email-deliverty-view.service';
import { TypeEmailVerificationEmailDeliveryInput } from 'supertokens-node/lib/build/recipe/emailverification/types';

type EmailVerificationContentInput = TypeEmailVerificationEmailDeliveryInput & {
  userContext: any;
};

export class EmailVerificationSMTPService extends SMTPService {
  private readonly viewService: EmailDeliverViewService<EmailVerificationContentInput>;

  constructor(
    smtpSettings: SMTPServiceConfig,
    templateFile = 'verify-user.mjml',
  ) {
    super({
      smtpSettings,
      override: (originalImplementation) => {
        return {
          ...originalImplementation,
          getContent: async (input: EmailVerificationContentInput) => {
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
