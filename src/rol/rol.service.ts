import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRolDto: CreateRolDto) {
    const existe = await this.prisma.rol.findUnique({
      where: { nombre: createRolDto.nombre },
    });

    if (existe) {
      throw new ConflictException('El rol ya existe');
    }

    return this.prisma.rol.create({
      data: createRolDto,
    });
  }

  findAll() {
    return this.prisma.rol.findMany();
  }

  async findOne(id: number) {
    const rol = await this.prisma.rol.findUnique({
      where: { id },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }

    return rol;
  }

  async update(id: number, updateRolDto: UpdateRolDto) {
    await this.findOne(id);

    return this.prisma.rol.update({
      where: { id },
      data: updateRolDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.rol.delete({
      where: { id },
    });
  }
}