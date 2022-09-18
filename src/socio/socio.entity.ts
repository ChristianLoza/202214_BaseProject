import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClubEntity } from '../club/club.entity';

@Entity()
export class SocioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  nombre: string;
  @Column()
  email: string;
  @Column()
  fecha_nacimiento: Date;
  @ManyToMany(() => ClubEntity, (club) => club.socios)
  clubes: ClubEntity[];
}
