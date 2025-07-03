import { Test, TestingModule } from '@nestjs/testing';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';

describe('FollowsController', () => {
  let appController: FollowsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FollowsController],
      providers: [FollowsService],
    }).compile();

    appController = app.get<FollowsController>(FollowsController);
  });

  describe('root', () => {
    it('should return "Follow Service running!"', () => {
      expect(appController.checkHelth()).toBe('Follow Service running!');
    });
  });
});
