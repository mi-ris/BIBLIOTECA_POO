import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsEmail()
  correo!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsInt()
  rolId!: number;

  @IsInt()
  tipoUsuarioId!: number;
}