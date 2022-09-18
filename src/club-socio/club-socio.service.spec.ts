import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ClubSocioService } from './club-socio.service';
import { ClubEntity } from '../club/club.entity';
import { memoryDB } from '../utils/specTestUtil/memory-d-b';
import { SocioEntity } from '../socio/socio.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let socioList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...memoryDB()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    clubRepository = module.get<Repository<ClubEntity>>(
      getRepositoryToken(ClubEntity),
    );
    socioRepository = module.get<Repository<SocioEntity>>(
      getRepositoryToken(SocioEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    socioRepository.clear();
    clubRepository.clear();

    socioList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await socioRepository.save({
        nombre: faker.name.fullName(),
        email: faker.internet.email(),
        fecha_nacimiento: faker.date.past(45),
        clubes: [],
      });
      socioList.push(socio);
    }

    club = await clubRepository.save({
      nombre: faker.name.fullName(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(3),
      fecha_fundacion: faker.date.past(15),
      socios: socioList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMemberToClub  club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.name.fullName(),
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.past(45),
    });

    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.name.fullName(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(3),
      fecha_fundacion: faker.date.past(15),
    });

    const result: ClubEntity = await service.addMemberToClub(
      newClub.id,
      newSocio.id,
    );

    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].nombre).toBe(newSocio.nombre);
    expect(result.socios[0].email).toBe(newSocio.email);
    expect(result.socios[0].fecha_nacimiento).toStrictEqual(
      newSocio.fecha_nacimiento,
    );
  });

  it('addMemberToClub invalido', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.name.fullName(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(3),
      fecha_fundacion: faker.date.past(15),
    });

    await expect(() =>
      service.addMemberToClub(newClub.id, '0'),
    ).rejects.toHaveProperty('message', 'Sin coincidencias');
  });

  it('addMemberToClub invalido', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.name.fullName(),
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.past(45),
    });

    await expect(() =>
      service.addMemberToClub('0', newSocio.id),
    ).rejects.toHaveProperty('message', 'Sin coincidencias');
  });

  it('findMembersFromClub  club', async () => {
    const socios: SocioEntity[] = await service.findMembersFromClub(club.id);
    expect(socios.length).toBe(5);
  });

  it('findMembersFromClub invalido', async () => {
    await expect(() => service.findMembersFromClub('0')).rejects.toHaveProperty(
      'message',
      'Sin coincidencias',
    );
  });

  it('findMemberFromClub club', async () => {
    const socio: SocioEntity = socioList[0];
    const storedSocio: SocioEntity = await service.findMemberFromClub(
      club.id,
      socio.id,
    );
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toBe(socio.nombre);
    expect(storedSocio.email).toBe(socio.email);
    expect(storedSocio.fecha_nacimiento).toStrictEqual(socio.fecha_nacimiento);
  });

  it('findMemberFromClub invalido', async () => {
    await expect(() =>
      service.findMemberFromClub(club.id, '0'),
    ).rejects.toHaveProperty('message', 'Sin coincidencias');
  });

  it('findMemberFromClub  invalido', async () => {
    const socio: SocioEntity = socioList[0];
    await expect(() =>
      service.findMemberFromClub('0', socio.id),
    ).rejects.toHaveProperty('message', 'Sin coincidencias');
  });

  it('findMemberFromClub error club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.name.fullName(),
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.past(45),
    });

    await expect(() =>
      service.findMemberFromClub(club.id, newSocio.id),
    ).rejects.toHaveProperty('message', 'El socio no esta asociado al club');
  });

  it('updateMembersFromClub   club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.name.fullName(),
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.past(45),
    });

    const updatedClub: ClubEntity = await service.updateMembersFromClub(
      club.id,
      [newSocio],
    );

    expect(updatedClub.socios.length).toBe(1);
    expect(updatedClub.socios[0]).not.toBeNull();
    expect(updatedClub.socios[0].nombre).toBe(newSocio.nombre);
    expect(updatedClub.socios[0].email).toBe(newSocio.email);
    expect(updatedClub.socios[0].fecha_nacimiento).toStrictEqual(
      newSocio.fecha_nacimiento,
    );
  });

  it('updateMembersFromClub invalido', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.name.fullName(),
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.past(45),
    });

    await expect(() =>
      service.updateMembersFromClub('0', [newSocio]),
    ).rejects.toHaveProperty('message', 'Sin coincidencias');
  });

  it('updateMembersFromClub   invalido', async () => {
    const newSocio: SocioEntity = socioList[0];
    newSocio.id = '0';

    await expect(() =>
      service.updateMembersFromClub(club.id, [newSocio]),
    ).rejects.toHaveProperty('message', 'Sin coincidencias');
  });

  it('deleteMemberFromClub club', async () => {
    const socio: SocioEntity = socioList[0];

    await service.deleteMemberFromClub(club.id, socio.id);

    const storedClub: ClubEntity = await clubRepository.findOne({
      where: { id: club.id },
      relations: ['socios'],
    });
    const deletedSocio: SocioEntity = storedClub.socios.find(
      (a) => a.id === socio.id,
    );

    expect(deletedSocio).toBeUndefined();
  });

  it('deleteMemberFromClub invalido', async () => {
    await expect(() =>
      service.deleteMemberFromClub(club.id, '0'),
    ).rejects.toHaveProperty('message', 'Sin coincidencias');
  });

  it('deleteMemberFromClub exception invalido', async () => {
    const socio: SocioEntity = socioList[0];

    await expect(() =>
      service.deleteMemberFromClub('0', socio.id),
    ).rejects.toHaveProperty('message', 'Sin coincidencias');
  });

  it('deleteMemberFromClub no asociado al club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.name.fullName(),
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.past(45),
    });

    await expect(() =>
      service.deleteMemberFromClub(club.id, newSocio.id),
    ).rejects.toHaveProperty('message', 'El socio no esta asociado al club');
  });
});
