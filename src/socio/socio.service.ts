import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpError, LogicException } from '../utils/errors/business-errors';
import { Repository } from 'typeorm';
import { SocioEntity } from './socio.entity';

@Injectable()
export class SocioService {
  constructor(
    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>,
  ) {}

  async findAll(): Promise<SocioEntity[]> {
    return await this.socioRepository.find({
      relations: ['clubes'],
    });
  }

  async findOne(id: string): Promise<SocioEntity> {
    const pais: SocioEntity = await this.socioRepository.findOne({
      where: { id },
      relations: ['clubes'],
    });
    if (pais) {
      return pais;
    } else {
      throw new LogicException('Sin coincidencias', HttpError.NOT_FOUND);
    }
  }

  async create(socio: SocioEntity): Promise<SocioEntity> {
    if (!socio.email.includes('@'))
      throw new LogicException('caracter @ faltante', HttpError.BAD_REQUEST);
    return await this.socioRepository.save(socio);
  }

  async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
    const persistedsocio: SocioEntity = await this.socioRepository.findOne({
      where: { id },
    });
    if (persistedsocio) {
      if (!socio.email.includes('@'))
        throw new LogicException('caracter @ faltante', HttpError.BAD_REQUEST);
      socio.id = id;
      return await this.socioRepository.save(socio);
    } else {
      throw new LogicException('Sin coincidencias', HttpError.NOT_FOUND);
    }
  }

  async delete(id: string) {
    const socio: SocioEntity = await this.socioRepository.findOne({
      where: { id },
    });
    if (socio) {
      await this.socioRepository.remove(socio);
    } else {
      throw new LogicException('Sin coincidencias', HttpError.NOT_FOUND);
    }
  }
}
