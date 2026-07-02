import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';

@Injectable()
export class PermisoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePermisoDto) {
    const existe = await this.prisma.permiso.findUnique({
      where: { nombre: dto.nombre },
    });

    if (existe) throw new ConflictException('El permiso ya existe');

    return this.prisma.permiso.create({ data: dto });
  }

  findAll() {
    return this.prisma.permiso.findMany();
  }

  async findOne(id: number) {
    const permiso = await this.prisma.permiso.findUnique({ where: { id } });

    if (!permiso) throw new NotFoundException(`Permiso con id ${id} no encontrado`);

    return permiso;
  }

  async update(id: number, dto: UpdatePermisoDto) {
    await this.findOne(id);

    return this.prisma.permiso.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.permiso.delete({ where: { id } });
  }
}