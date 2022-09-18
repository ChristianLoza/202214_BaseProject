import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from '../../socio/socio.entity';
import { ClubEntity } from '../../club/club.entity';

export const memoryDB = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [SocioEntity, ClubEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([SocioEntity, ClubEntity]),
];
