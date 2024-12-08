import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { MoodService } from './mood.service'
import { ApiResponse, ApiTags,  } from '@nestjs/swagger'
import { MoodEntity } from './mood.entity'

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

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Get a mood',
        type: MoodEntity,
    })
    async findOne(@Param('id') id: string): Promise<MoodEntity> {
        const data = await this.moodService.findOne(+id)
        return data
    }

    @Post()
    @ApiResponse({
        status: 201,
        description: 'Create a mood',
        type: MoodEntity,
    })
    async create(@Body() body: Partial<MoodEntity>): Promise<MoodEntity> {
        const data = await this.moodService.create(body)
        return data
    }
}