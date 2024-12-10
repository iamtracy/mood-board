import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MoodEntity } from '../entities/mood.entity'

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

  async create(data: Partial<MoodEntity>): Promise<MoodEntity> {
    const mood = this.moodRepository.create(data)
    return this.moodRepository.save(mood)
  }

  async remove(id: number): Promise<void> {
    await this.moodRepository.delete(id)
  }
}
