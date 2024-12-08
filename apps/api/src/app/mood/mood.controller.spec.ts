import { Test, TestingModule } from '@nestjs/testing'
import { MoodController } from './mood.controller'
import { MoodService } from './mood.service'
import { MoodEntity } from './mood.entity'

describe('MoodController', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [MoodController],
      providers: [MoodService],
      imports: [MoodEntity],
    }).compile()
  })

  describe('getData', () => {
    it.skip('should return "Hello API"', () => {
      const appController = app.get<MoodController>(MoodController)
      expect(appController.findAll()).toEqual([])
    })
  })
})
