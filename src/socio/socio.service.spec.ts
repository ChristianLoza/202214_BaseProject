import { Test, TestingModule } from '@nestjs/testing';
import { memoryDB } from '../utils/specTestUtil/memory-d-b';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let socioList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...memoryDB()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(
      getRepositoryToken(SocioEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    socioList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repository.save({
        nombre: faker.name.fullName(),
        email: faker.internet.email(),
        fecha_nacimiento: faker.date.past(45),
      });
      socioList.push(socio);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll  socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(socioList.length);
  });

  it('findOne  id', async () => {
    const storedSocio: SocioEntity = socioList[0];
    const socio: SocioEntity = await service.findOne(storedSocio.id);
    expect(socio).not.toBeNull();
    expect(socio.nombre).toEqual(storedSocio.nombre);
  });

  it('findOne invalido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'Sin coincidencias',
    );
  });

  it('create socio', async () => {
    const socio: SocioEntity = {
      id: '',
      nombre: faker.name.fullName(),
      email: faker.internet.email(),
      fecha_nacimiento: faker.date.past(45),
      clubes: [],
    };

    const newSocio: SocioEntity = await service.create(socio);
    expect(newSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({
      where: { id: `${newSocio.id}` },
    });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toEqual(newSocio.nombre);
  });

  it('create withour at', async () => {
    const socio: SocioEntity = {
      id: '',
      nombre: faker.name.fullName(),
      email: 'testemail.gmail.com',
      fecha_nacimiento: faker.date.past(45),
      clubes: [],
    };

    await expect(() => service.create(socio)).rejects.toHaveProperty(
      'message',
      'caracter @ faltante',
    );
  });

  it('Update socio', async () => {
    const socio: SocioEntity = socioList[0];
    socio.nombre = 'New name';

    const updatedSocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({
      where: { id: `${socio.id}` },
    });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toEqual(socio.nombre);
  });

  it('update  invalido', async () => {
    let socio: SocioEntity = socioList[0];
    socio = {
      ...socio,
      nombre: 'New name',
    };
    await expect(() => service.update('0', socio)).rejects.toHaveProperty(
      'message',
      'Sin coincidencias',
    );
  });

  it('update ', async () => {
    let socio: SocioEntity = socioList[0];
    socio = {
      ...socio,
      email: 'testemail.gmail.com',
    };
    await expect(() => service.update(socio.id, socio)).rejects.toHaveProperty(
      'message',
      'caracter @ faltante',
    );
  });

  it('delete', async () => {
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);

    const deletedSocio: SocioEntity = await repository.findOne({
      where: { id: `${socio.id}` },
    });
    expect(deletedSocio).toBeNull();
  });

  it('delete', async () => {
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'Sin coincidencias',
    );
  });
});
