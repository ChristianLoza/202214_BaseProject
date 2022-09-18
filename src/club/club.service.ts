import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpError, LogicException } from '../utils/errors/business-errors';
import { Repository } from 'typeorm';
import { ClubEntity } from './club.entity';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,
  ) {}

  async findAll(): Promise<ClubEntity[]> {
    return await this.clubRepository.find({
      relations: ['socios'],
    });
  }

  async findOne(id: string): Promise<ClubEntity> {
    const pais: ClubEntity = await this.clubRepository.findOne({
      where: { id },
      relations: ['socios'],
    });
    if (!pais)
      throw new LogicException('Sin coincidencias', HttpError.NOT_FOUND);

    return pais;
  }

  async create(club: ClubEntity): Promise<ClubEntity> {
    if (club.descripcion.trim().length > 100)
      throw new LogicException(
        'descripcion mayor a 100 caracteres',
        HttpError.BAD_REQUEST,
      );
    return await this.clubRepository.save(club);
  }

  async update(id: string, club: ClubEntity): Promise<ClubEntity> {
    const persistedsocio: ClubEntity = await this.clubRepository.findOne({
      where: { id },
    });
    if (!persistedsocio)
      throw new LogicException('Sin coincidencias', HttpError.NOT_FOUND);
    if (club.descripcion.trim().length > 100)
      throw new LogicException(
        'descripcion mayor a 100 caracteres',
        HttpError.BAD_REQUEST,
      );

    club.id = id;

    return await this.clubRepository.save(club);
  }

  async delete(id: string) {
    const [club] = await Promise.all([
      this.clubRepository.findOne({
        where: { id },
      }),
    ]);
    if (!club)
      throw new LogicException('Sin coincidencias', HttpError.NOT_FOUND);

    await this.clubRepository.remove(club);
  }
}
