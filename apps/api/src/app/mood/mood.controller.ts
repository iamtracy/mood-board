import { Controller, Get } from '@nestjs/common';
import { MoodService } from './mood.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MoodEntity } from './mood.entity';

@ApiTags('mood')
@Controller('mood')
export class MoodController {
    constructor(
        private moodService: MoodService,
    ) {}

    @Get()
    @ApiResponse({
        status: 200,
        description: 'Get all moods',
        type: MoodEntity,
    })
    async findAll(): Promise<MoodEntity[]> {
        const data = await this.moodService.findAll()
        return data
    }
}