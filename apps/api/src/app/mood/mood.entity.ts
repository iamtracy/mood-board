import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'mood',
})
export class MoodEntity {
  @PrimaryGeneratedColumn()
  id: number;
}