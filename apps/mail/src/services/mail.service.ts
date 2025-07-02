import { Injectable } from "@nestjs/common";
import { PayloadNotificationDto } from "../utils/dto/payloadNotification.dto";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService){}

    async sendNotification(user: PayloadNotificationDto): Promise<void> {
    console.log(`Notification sent: User ID: ${user.userId}, Email: ${user.email}, Username: ${user.username}`);
    // Here you would implement the actual notification logic
  }

  async verifyEmailNotification(user: PayloadNotificationDto): Promise<void> {
    console.log(`Sending verification email to: ${user.email}`);
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Verify your email",
      // template: 'verify-email', // 'verify-email.hbs'
      text: `Hello ${user.username}, please verify your email by clicking on the link below.`,
      // attachments: user.attachments?.map(attachment => ({
      //   filename: attachment.filename,
       context: {
        username: user.username,
        token: user.token,
      },
    })
  }
  async testSend(email: string): Promise<any> {
    console.log(`Sending test email to: ${email}`);
    return this.mailerService.sendMail({
       to: email,
        subject: "Verify your email",
        text: `Hello, please verify your email by clicking on the link below.`,
    })
  }

  async checkHealth(): Promise<string> {
    return "Mail service is running";
  }
}