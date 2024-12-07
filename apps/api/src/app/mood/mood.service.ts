
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MoodEntity } from './mood.entity'

@Injectable()
export class MoodService {
  constructor(
    @InjectRepository(MoodEntity)
    private moodRepository: Repository<MoodEntity>,
  ) {}

  findAll(): Promise<MoodEntity[]> {
    return this.moodRepository.find()
  }

  findOne(id: number): Promise<MoodEntity | null> {
    return this.moodRepository.findOneBy({ id })
  }

  async remove(id: number): Promise<void> {
    await this.moodRepository.delete(id)
  }
}
