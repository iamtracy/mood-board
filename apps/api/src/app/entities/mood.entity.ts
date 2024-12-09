import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
    name: 'mood',
})
export class MoodEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'The id of a mood' })
  id: number

  @Column()
  @ApiProperty({ example: 'happy', description: 'A mood' })
  mood: string
}