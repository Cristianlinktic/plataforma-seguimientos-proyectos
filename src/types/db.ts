export type EstadoActividad = "PENDIENTE" | "EN_CURSO" | "CERRADA";

export type RolUsuario = "ADMIN" | "LECTOR";

// Formas de fila tal como las devuelve Postgres/PostgREST (fechas como texto ISO).
export type UserRow = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: RolUsuario;
  createdAt: string;
};

export type ProyectoRow = {
  id: string;
  nombre: string;
  descripcion: string | null;
  faseActual: string | null;
  fechaCorte: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FrenteRow = {
  id: string;
  nombre: string;
  orden: number;
  proyectoId: string;
};

export type ActividadRow = {
  id: string;
  numero: number;
  nombre: string;
  responsable: string;
  estado: EstadoActividad;
  porcentaje: number;
  fechaInicio: string;
  fechaFin: string;
  createdAt: string;
  updatedAt: string;
  proyectoId: string;
  frenteId: string | null;
};

// Formas ya "hidratadas" que usa el resto de la app (fechas como Date).
export type Proyecto = Omit<ProyectoRow, "fechaCorte" | "createdAt" | "updatedAt"> & {
  fechaCorte: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Frente = FrenteRow;

export type Actividad = Omit<ActividadRow, "fechaInicio" | "fechaFin" | "createdAt" | "updatedAt"> & {
  fechaInicio: Date;
  fechaFin: Date;
  createdAt: Date;
  updatedAt: Date;
};

export function hydrateProyecto(row: ProyectoRow): Proyecto {
  return {
    ...row,
    fechaCorte: row.fechaCorte ? new Date(row.fechaCorte) : null,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

export function hydrateActividad(row: ActividadRow): Actividad {
  return {
    ...row,
    fechaInicio: new Date(row.fechaInicio),
    fechaFin: new Date(row.fechaFin),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}
