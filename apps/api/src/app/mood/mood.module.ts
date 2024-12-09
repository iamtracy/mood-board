
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MoodEntity } from '../entities/mood.entity'
import { MoodService } from './mood.service'
import { MoodController } from './mood.controller'

@Module({
  imports: [TypeOrmModule.forFeature([MoodEntity])],
  providers: [MoodService],
  controllers: [MoodController],
})
export class MoodModule {}
