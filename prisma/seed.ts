import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.rol.upsert({
    where: { nombre: 'Administrador' },
    update: {},
    create: { nombre: 'Administrador', descripcion: 'Acceso completo al sistema' },
  });

  const bibliotecario = await prisma.rol.upsert({
    where: { nombre: 'Bibliotecario' },
    update: {},
    create: { nombre: 'Bibliotecario', descripcion: 'Gestiona libros y préstamos' },
  });

  const usuario = await prisma.rol.upsert({
    where: { nombre: 'Usuario' },
    update: {},
    create: { nombre: 'Usuario', descripcion: 'Consulta y solicita libros' },
  });

  const permisos = [
    'crear_usuario',
    'consultar_usuario',
    'editar_usuario',
    'eliminar_usuario',
    'crear_rol',
    'consultar_rol',
    'editar_rol',
    'eliminar_rol',
    'crear_permiso',
    'consultar_permiso',
    'editar_permiso',
    'eliminar_permiso',
    'crear_libro',
    'consultar_libro',
    'editar_libro',
    'eliminar_libro',
    'crear_prestamo',
    'consultar_prestamo',
    'editar_prestamo',
    'cancelar_prestamo',
    'registrar_devolucion',
    'consultar_devolucion',
    'crear_reserva',
    'consultar_reserva',
    'cancelar_reserva',
    'crear_multa',
    'consultar_multa',
    'editar_multa',
  ];

  for (const nombre of permisos) {
    await prisma.permiso.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  const todosPermisos = await prisma.permiso.findMany();

  for (const permiso of todosPermisos) {
    await prisma.rolPermiso.upsert({
      where: {
        rolId_permisoId: {
          rolId: admin.id,
          permisoId: permiso.id,
        },
      },
      update: {},
      create: {
        rolId: admin.id,
        permisoId: permiso.id,
      },
    });
  }

  const permisosBibliotecario = todosPermisos.filter((p) =>
    [
      'consultar_usuario',
      'editar_usuario',
      'crear_libro',
      'consultar_libro',
      'editar_libro',
      'crear_prestamo',
      'consultar_prestamo',
      'editar_prestamo',
      'cancelar_prestamo',
      'registrar_devolucion',
      'consultar_devolucion',
      'crear_reserva',
      'consultar_reserva',
      'cancelar_reserva',
      'crear_multa',
      'consultar_multa',
      'editar_multa',
    ].includes(p.nombre),
  );

  for (const permiso of permisosBibliotecario) {
    await prisma.rolPermiso.upsert({
      where: {
        rolId_permisoId: {
          rolId: bibliotecario.id,
          permisoId: permiso.id,
        },
      },
      update: {},
      create: {
        rolId: bibliotecario.id,
        permisoId: permiso.id,
      },
    });
  }

  const permisosUsuario = todosPermisos.filter((p) =>
    [
      'consultar_libro',
      'crear_prestamo',
      'consultar_prestamo',
      'crear_reserva',
      'consultar_reserva',
      'cancelar_reserva',
      'consultar_multa',
    ].includes(p.nombre),
  );

  for (const permiso of permisosUsuario) {
    await prisma.rolPermiso.upsert({
      where: {
        rolId_permisoId: {
          rolId: usuario.id,
          permisoId: permiso.id,
        },
      },
      update: {},
      create: {
        rolId: usuario.id,
        permisoId: permiso.id,
      },
    });
  }

  await prisma.tipoUsuario.upsert({
    where: { nombre: 'Profesor' },
    update: {},
    create: { nombre: 'Profesor', descripcion: 'Préstamo gratuito', descuento: 100, diasPrestamo: 15 },
  });

  await prisma.tipoUsuario.upsert({
    where: { nombre: 'Estudiante' },
    update: {},
    create: { nombre: 'Estudiante', descripcion: '50% de descuento', descuento: 50, diasPrestamo: 10 },
  });

  await prisma.tipoUsuario.upsert({
    where: { nombre: 'Cliente' },
    update: {},
    create: { nombre: 'Cliente', descripcion: 'Usuario externo', descuento: 0, diasPrestamo: 10 },
  });

  console.log('Seed ejecutado correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });