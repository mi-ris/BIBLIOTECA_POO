import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RolService } from './rol.service';
import { RolController } from './rol.controller';

@Module({
  imports: [PrismaModule],
  controllers: [RolController],
  providers: [RolService],
})
export class RolModule {}