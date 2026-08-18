-- CreateEnum
CREATE TYPE "EstadoActividad_seguimiento" AS ENUM ('PENDIENTE', 'EN_CURSO', 'CERRADA');

-- CreateTable
CREATE TABLE "User_seguimiento" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_seguimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proyecto_seguimiento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "faseActual" TEXT,
    "fechaCorte" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proyecto_seguimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Frente_seguimiento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "proyectoId" TEXT NOT NULL,

    CONSTRAINT "Frente_seguimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actividad_seguimiento" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "responsable" TEXT NOT NULL,
    "estado" "EstadoActividad_seguimiento" NOT NULL DEFAULT 'PENDIENTE',
    "porcentaje" INTEGER NOT NULL DEFAULT 0,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "proyectoId" TEXT NOT NULL,
    "frenteId" TEXT,

    CONSTRAINT "Actividad_seguimiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_seguimiento_email_key" ON "User_seguimiento"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Frente_seguimiento_proyectoId_nombre_key" ON "Frente_seguimiento"("proyectoId", "nombre");

-- CreateIndex
CREATE INDEX "Actividad_seguimiento_proyectoId_idx" ON "Actividad_seguimiento"("proyectoId");

-- CreateIndex
CREATE INDEX "Actividad_seguimiento_frenteId_idx" ON "Actividad_seguimiento"("frenteId");

-- AddForeignKey
ALTER TABLE "Frente_seguimiento" ADD CONSTRAINT "Frente_seguimiento_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto_seguimiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actividad_seguimiento" ADD CONSTRAINT "Actividad_seguimiento_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto_seguimiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actividad_seguimiento" ADD CONSTRAINT "Actividad_seguimiento_frenteId_fkey" FOREIGN KEY ("frenteId") REFERENCES "Frente_seguimiento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
