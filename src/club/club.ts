import { IsDateString, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class Club {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsUrl()
  @IsNotEmpty()
  imagen: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_fundacion: string;
}
