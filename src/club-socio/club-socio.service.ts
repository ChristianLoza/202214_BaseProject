import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubEntity } from '../club/club.entity';
import { HttpError, LogicException } from '../utils/errors/business-errors';
import { SocioEntity } from '../socio/socio.entity';

@Injectable()
export class ClubSocioService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,
    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>,
  ) {}

  async addMemberToClub(clubId: string, socioId: string): Promise<ClubEntity> {
    const [socio] = await Promise.all([
      this.socioRepository.findOne({
        where: { id: socioId },
      }),
    ]);

    if (socio) {
      const club: ClubEntity = await this.clubRepository.findOne({
        where: { id: clubId },
        relations: ['socios'],
      });
      if (club) {
        club.socios = [...club.socios, socio];
        return await this.clubRepository.save(club);
      } else {
        throw new LogicException('Sin coincidencias', HttpError.NOT_FOUND);
      }
    } else {
      throw new LogicException('Sin coincidencias', HttpError.NOT_FOUND);
    }
  }

  async findMembersFromClub(clubId: string): Promise<SocioEntity[]> {
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });
    if (club) {
      return club.socios;
    } else {
      throw new LogicException('Sin coincidencias', HttpError.NOT_FOUND);
    }
  }

  async findMemberFromClub(
    clubId: string,
    socioId: string,
  ): Promise<SocioEntity> {
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });

    if (club) {
      const socio: SocioEntity = await this.socioRepository.findOne({
        where: { id: socioId },
      });
      if (socio) {
        let socioClub: SocioEntity;
        // eslint-disable-next-line prefer-const
        socioClub = club.socios.find((e) => e.id === socio.id);
        if (socioClub) {
          return socioClub;
        } else {
          throw new LogicException(
            'El socio no esta asociado al club',
            HttpError.PRECONDITION_FAILED,
          );
        }
      } else {
        throw new LogicException('Sin coincidencias', HttpError.NOT_FOUND);
      }
    } else {
      throw new LogicException('Sin coincidencias', HttpError.NOT_FOUND);
    }
  }

  async updateMembersFromClub(
    clubId: string,
    socios: SocioEntity[],
  ): Promise<ClubEntity> {
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });
    if (!club)
      throw new LogicException('Sin coincidencias', HttpError.NOT_FOUND);

    for (const item of socios) {
      const [socio] = await Promise.all([
        this.socioRepository.findOne({
          where: { id: `${item.id}` },
        }),
      ]);
      if (socio) {
      } else {
        throw new LogicException('Sin coincidencias', HttpError.NOT_FOUND);
      }
    }

    club.socios = socios;
    return await this.clubRepository.save(club);
  }

  async deleteMemberFromClub(clubId: string, socioId: string) {
    const club: ClubEntity = await this.clubRepository.findOne({
      where: { id: clubId },
      relations: ['socios'],
    });

    if (club) {
      const socio: SocioEntity = await this.socioRepository.findOne({
        where: { id: socioId },
      });
      if (!socio)
        throw new LogicException('Sin coincidencias', HttpError.NOT_FOUND);
      const socioClub: SocioEntity = club.socios.find((e) => e.id === socio.id);
      if (socioClub) {
        club.socios = club.socios.filter((e) => e.id !== socioId);
        await this.clubRepository.save(club);
      } else {
        throw new LogicException(
          'El socio no esta asociado al club',
          HttpError.PRECONDITION_FAILED,
        );
      }
    } else {
      throw new LogicException('Sin coincidencias', HttpError.NOT_FOUND);
    }
  }
}
