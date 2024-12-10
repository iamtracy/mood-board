import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { MoodService } from './mood.service'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { MoodEntity } from '../entities/mood.entity'

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
        return await this.moodService.findAll()
    }

    @Get(':id')
    @ApiResponse({
        status: 200,
        description: 'Get a mood',
        type: MoodEntity,
    })
    async findOne(@Param('id') id: string): Promise<MoodEntity> {
        return await this.moodService.findOne(+id)
    }

    @Post()
    @ApiResponse({
        status: 201,
        description: 'Create a mood',
        type: MoodEntity,
    })
    async create(@Body() body: Partial<MoodEntity>): Promise<MoodEntity> {
        return await this.moodService.create(body)
    }

    @Put()
    @ApiResponse({
        status: 200,
        description: 'Update a mood',
        type: MoodEntity,
    })
    async update(@Body() body: Partial<MoodEntity>): Promise<MoodEntity> {
        return await this.moodService.update(body.id, body)
    }

    @Delete(':id')
    @ApiResponse({
        status: 200,
        description: 'Delete a mood',
        type: MoodEntity,
    })
    async delete(@Param('id') id: string) {
        return await this.moodService.delete(+id)
    }
}