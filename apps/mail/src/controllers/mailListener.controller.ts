import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { MailService } from "../services/mail.service";
import { EventPattern } from "@nestjs/microservices";
import { PayloadNotificationDto } from "../utils/dto/payloadNotification.dto";

@Controller()
export class MailListenerController {
    constructor( private readonly mailService: MailService){}

    @EventPattern('user-created')
    async verifyEmailNotification(user: PayloadNotificationDto): Promise<void> {
        try {
            await this.mailService.verifyEmailNotification(user);
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }
}