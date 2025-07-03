import { Injectable } from '@nestjs/common';
import { FollowDto } from './dto/follows.dto';
import { Follow } from './entities/follow.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private readonly repo: Repository<Follow>,
  ) {}

  checkHelth(): string {
    return 'Follow Service running!';
  }

  async findFollowById(followId: string): Promise<Follow | null> {
    const follow = await this.repo.findOne({ where: { id: followId } });
    return follow;
  }

  async findFollowers(followId: string): Promise<[Follow[], number]> {
    const followers = await this.repo.findAndCount({
      where: { followedId: followId },
    });
    return followers;
  }

  async findFollowing(followId: string): Promise<[Follow[], number]> {
    const following = await this.repo.findAndCount({
      where: { followerId: followId },
    });
    return following;
  }

  async countFollowers(id: string): Promise<number> {
    return this.repo.count({ where: { followedId:  id} });
  }

  async countFollowing(id: string): Promise<number> {
    return this.repo.count({ where: { followerId: id } });
  }

  async handleFollowedEvent(data: FollowDto) {
    console.log('Followed event received:', data);
    const newFollow = this.repo.create({
      followerId: data.followerId,
      followedId: data.followedId,
    });

    await this.repo.save(newFollow);
    console.log('Follow relationship saved:', newFollow);
  }

  async handleUnfollowEvent(data: FollowDto): Promise<DeleteResult | null> {

    const result = await this.repo.delete({
      followerId: data.followerId,
      followedId: data.followedId,
    });

    if (result.affected && result.affected > 0) {
      console.log('Follow relationship deleted');
      return result;
    } else {
      console.log('No follow relationship found to remove');
      return null;
    }
  }
}
