import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SocioEntity } from '../socio/socio.entity';

@Entity()
export class ClubEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  fecha_fundacion: Date;

  @Column()
  imagen: string;

  @Column()
  descripcion: string;

  @ManyToMany(() => SocioEntity, (socio) => socio.clubes)
  @JoinTable()
  socios: SocioEntity[];
}
