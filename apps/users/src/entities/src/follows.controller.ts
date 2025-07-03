import { Controller, Get } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { FollowDto } from './dto/follows.dto';

@Controller()
export class FollowsController {
  constructor(private readonly followService: FollowsService) {}

  @Get()
  checkHelth(): string {
    return this.followService.checkHelth();
  }

  @EventPattern('followed')
  async handleFollowedEvent(@Payload() data: FollowDto) {
    console.log('Followed event received:', data);
    await this.followService.handleFollowedEvent(data);
  }

  @EventPattern('unfollow')
  async handleUnfollowEvent(@Payload() data: FollowDto) {
    console.log('Followed event received:', data);
    await this.followService.handleFollowedEvent(data);
  }


  @Get('followers/:followedId')
  async findFollowers(@Payload('followedId') followedId: string) {
    return this.followService.findFollowers(followedId);
  }

  @Get('following/:followerId')
  async findFollowing(@Payload('followerId') followerId: string) {
    return this.followService.findFollowing(followerId);
  }

  @Get('follow/:followId')
  async findFollowById(@Payload('followId') followId: string) {
    return this.followService.findFollowById(followId);
  }
}
