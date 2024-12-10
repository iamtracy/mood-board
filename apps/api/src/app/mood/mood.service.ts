import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'
import { MoodEntity } from '../entities/mood.entity'

@Injectable()
export class MoodService {
  constructor(
    @InjectRepository(MoodEntity)
    private moodRepository: Repository<MoodEntity>,
  ) {}

  async findAll(): Promise<MoodEntity[]> {
    return this.moodRepository.find()
  }

  async findOne(id: number): Promise<MoodEntity | null> {
    return this.moodRepository.findOneBy({ id })
  }

  async create(data: Partial<MoodEntity>): Promise<MoodEntity> {
    return this.moodRepository.save(data)
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.moodRepository.delete(id)
  }
}
