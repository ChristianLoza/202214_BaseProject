import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../utils/interceptors/business-errors.interceptor';
import { Club } from './club';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Get()
  async findAll() {
    return this.clubService.findAll();
  }

  @Get(':clubId')
  async findOne(@Param('clubId') clubId: string) {
    return this.clubService.findOne(clubId);
  }

  @Post()
  async create(@Body() clubDto: Club) {
    let club: ClubEntity;
    // eslint-disable-next-line prefer-const
    club = plainToInstance(ClubEntity, clubDto);
    return this.clubService.create(club);
  }

  @Put(':clubId')
  async update(@Param('clubId') clubId: string, @Body() clubDto: Club) {
    let club: ClubEntity;
    // eslint-disable-next-line prefer-const
    club = plainToInstance(ClubEntity, clubDto);
    return this.clubService.update(clubId, club);
  }

  @Delete(':clubId')
  @HttpCode(204)
  async delete(@Param('clubId') clubId: string) {
    return this.clubService.delete(clubId);
  }
}
