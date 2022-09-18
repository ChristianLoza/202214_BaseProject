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
import { Socio } from './socio';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {
  constructor(private readonly socioService: SocioService) {}

  @Get()
  async findAll() {
    return await this.socioService.findAll();
  }

  @Get(':socioId')
  async findOne(@Param('socioId') socioId: string) {
    return await this.socioService.findOne(socioId);
  }

  @Post()
  async create(@Body() socioDto: Socio) {
    let socio: SocioEntity;
    // eslint-disable-next-line prefer-const
    socio = plainToInstance(SocioEntity, socioDto);
    return await this.socioService.create(socio);
  }

  @Put(':socioId')
  async update(@Param('socioId') socioId: string, @Body() socioDto: Socio) {
    let socio: SocioEntity;
    // eslint-disable-next-line prefer-const
    socio = plainToInstance(SocioEntity, socioDto);
    return await this.socioService.update(socioId, socio);
  }

  @Delete(':socioId')
  @HttpCode(204)
  async delete(@Param('socioId') socioId: string) {
    return await this.socioService.delete(socioId);
  }
}
