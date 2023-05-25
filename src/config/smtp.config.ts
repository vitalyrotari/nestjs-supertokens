import { cleanEnv, port, str } from 'envalid';

export default () => {
  const env = cleanEnv(process.env, {
    SMTP_HOST: str({ example: 'email-smtp.eu-west-2.amazonaws.com' }),
    SMTP_PORT: port({
      choices: [25, 587, 2587, 465, 2465, 2525],
      devDefault: 25,
      default: 465,
    }),
    SMTP_USER: str(),
    SMTP_PASS: str(),
    SMTP_SENDFROM: str({ desc: 'The email address of the sender (your app)' }),
  });

  return {
    smtp: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      user: env.SMTP_USER,
      password: env.SMTP_PASS,
      sendfrom: env.SMTP_SENDFROM,
    },
  };
};
