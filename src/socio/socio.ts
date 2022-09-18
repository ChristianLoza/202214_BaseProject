import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class Socio {
  @IsString()
  @IsNotEmpty()
  nombre: string;
  @IsNotEmpty()
  email: string;
  @IsDateString()
  @IsNotEmpty()
  fecha_nacimiento: string;
}
