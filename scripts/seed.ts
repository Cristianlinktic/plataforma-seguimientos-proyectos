import "dotenv/config";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  throw new Error(
    "Configura NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en tu archivo .env antes de sembrar datos."
  );
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TABLES = {
  user: "User_seguimiento",
  proyecto: "Proyecto_seguimiento",
  frente: "Frente_seguimiento",
  actividad: "Actividad_seguimiento",
} as const;

type EstadoSeed = "PENDIENTE" | "EN_CURSO" | "CERRADA";

type ActividadSeed = {
  numero: number;
  nombre: string;
  responsable: string;
  estado: EstadoSeed;
  porcentaje: number;
  inicio: string;
  fin: string;
};

// Datos importados de "Gantt Materan.xlsx" (fecha de corte: 11 de agosto de 2026).
const FRENTES: { nombre: string; actividades: ActividadSeed[] }[] = [
  {
    nombre: "Estrategia",
    actividades: [
      { numero: 1, nombre: "Benchmark de competencia", responsable: "Luis Cuellar", estado: "CERRADA", porcentaje: 100, inicio: "2026-07-27", fin: "2026-07-30" },
      { numero: 2, nombre: "Estrategia de lanzamiento", responsable: "Alejandro Marín - Analista MKT", estado: "CERRADA", porcentaje: 100, inicio: "2026-08-10", fin: "2026-08-14" },
      { numero: 3, nombre: "Estrategia de relacionamiento y PR", responsable: "Natalia Ochoa - CM", estado: "CERRADA", porcentaje: 100, inicio: "2026-08-10", fin: "2026-08-14" },
      { numero: 4, nombre: "Definición de la fecha de lanzamiento", responsable: "Dirección de Marca", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-08-31", fin: "2026-08-31" },
    ],
  },
  {
    nombre: "Digital / RRSS",
    actividades: [
      { numero: 5, nombre: "Creación de las cuentas de RRSS", responsable: "Natalia Ochoa - CM", estado: "CERRADA", porcentaje: 100, inicio: "2026-07-27", fin: "2026-07-31" },
      { numero: 6, nombre: "Parrilla de contenido — expectativa", responsable: "Natalia Ochoa - CM", estado: "EN_CURSO", porcentaje: 20, inicio: "2026-08-18", fin: "2026-08-21" },
      { numero: 7, nombre: "Parrilla de contenido — lanzamiento", responsable: "Natalia Ochoa - CM", estado: "EN_CURSO", porcentaje: 20, inicio: "2026-08-18", fin: "2026-08-21" },
      { numero: 8, nombre: "Producción de piezas gráficas y audiovisuales", responsable: "Estefanny Botache y David Cadena", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-08-24", fin: "2026-08-28" },
      { numero: 9, nombre: "Publicación de la fase de expectativa", responsable: "Natalia Ochoa - CM", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-09-01", fin: "2026-09-30" },
      { numero: 10, nombre: "Lanzamiento de marca en RRSS", responsable: "Natalia Ochoa - CM", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-11-01", fin: "2026-11-30" },
    ],
  },
  {
    nombre: "E-commerce",
    actividades: [
      { numero: 11, nombre: "Primera propuesta de UX/UI", responsable: "Valeria Barrera - D. Ux Ui", estado: "CERRADA", porcentaje: 100, inicio: "2026-07-01", fin: "2026-07-15" },
      { numero: 12, nombre: "Ajustes y aprobación de UX/UI", responsable: "Valeria Barrera - D. Ux Ui", estado: "EN_CURSO", porcentaje: 10, inicio: "2026-08-11", fin: "2026-08-31" },
      { numero: 13, nombre: "Apertura de la cuenta Shopify", responsable: "Luis Cuellar", estado: "CERRADA", porcentaje: 100, inicio: "2026-06-01", fin: "2026-06-03" },
      { numero: 14, nombre: "Configuración de la pasarela de pago", responsable: "Luis Cuellar", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-09-01", fin: "2026-09-04" },
      { numero: 15, nombre: "Configuración de facturación electrónica", responsable: "Luis Cuellar y legal", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-09-01", fin: "2026-09-04" },
      { numero: 16, nombre: "Maquetación y desarrollo del sitio", responsable: "Cristian Sabogal - DEV", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-09-01", fin: "2026-09-10" },
      { numero: 17, nombre: "Carga de catálogo y fichas de producto", responsable: "Cristian Sabogal - DEV", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-09-11", fin: "2026-09-11" },
      { numero: 18, nombre: "Pruebas y salida a producción", responsable: "Cristian Sabogal - DEV", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-11-01", fin: "2026-11-01" },
    ],
  },
  {
    nombre: "Producto",
    actividades: [
      { numero: 19, nombre: "Pago de las prendas al proveedor", responsable: "Daniel Salinas", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-08-11", fin: "2026-08-14" },
      { numero: 20, nombre: "Producción y entrega de las prendas", responsable: "Fábrica CI Trading", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-08-18", fin: "2026-09-30" },
      { numero: 21, nombre: "Recepción y control de calidad", responsable: "Coordinación de Producto", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-10-08", fin: "2026-10-10" },
      { numero: 22, nombre: "Sesión de fotos de producto", responsable: "Audiovisual", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-10-12", fin: "2026-10-12" },
    ],
  },
  {
    nombre: "Packaging",
    actividades: [
      { numero: 23, nombre: "Diseño de la PR Box", responsable: "Estefanny Botache - D. Grafica", estado: "CERRADA", porcentaje: 100, inicio: "2026-07-01", fin: "2026-07-07" },
      { numero: 24, nombre: "Diseño de la bolsa de papel", responsable: "Estefanny Botache - D. Grafica", estado: "CERRADA", porcentaje: 100, inicio: "2026-07-01", fin: "2026-07-07" },
      { numero: 25, nombre: "Diseño de la bolsa de tela", responsable: "Estefanny Botache - D. Grafica", estado: "CERRADA", porcentaje: 100, inicio: "2026-07-01", fin: "2026-07-07" },
      { numero: 26, nombre: "Diseño de las marquillas tejidas", responsable: "Estefanny Botache - D. Grafica", estado: "CERRADA", porcentaje: 100, inicio: "2026-07-01", fin: "2026-07-07" },
      { numero: 27, nombre: "Diseño de las etiquetas de cartón", responsable: "Estefanny Botache - D. Grafica", estado: "CERRADA", porcentaje: 100, inicio: "2026-07-01", fin: "2026-07-07" },
      { numero: 28, nombre: "Diseño del certificado de autenticidad", responsable: "Estefanny Botache - D. Grafica", estado: "CERRADA", porcentaje: 100, inicio: "2026-07-01", fin: "2026-07-07" },
      { numero: 29, nombre: "Aprobación de las marquillas tejidas", responsable: "Luiseth", estado: "CERRADA", porcentaje: 100, inicio: "2026-08-10", fin: "2026-08-10" },
      { numero: 30, nombre: "Producción de las marquillas tejidas", responsable: "MQS SAS", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-08-18", fin: "2026-09-08" },
      { numero: 31, nombre: "Aprobación y ajustes — PR Box", responsable: "Luiseth / Diseño G.", estado: "EN_CURSO", porcentaje: 0, inicio: "2026-08-10", fin: "2026-08-21" },
      { numero: 32, nombre: "Aprobación y ajustes — bolsa de papel", responsable: "Luiseth / Diseño G.", estado: "CERRADA", porcentaje: 100, inicio: "2026-08-03", fin: "2026-08-11" },
      { numero: 33, nombre: "Aprobación y ajustes — bolsa de tela", responsable: "Luiseth / Diseño G.", estado: "CERRADA", porcentaje: 100, inicio: "2026-08-03", fin: "2026-08-11" },
      { numero: 34, nombre: "Aprobación y ajustes — etiquetas de cartón", responsable: "Luiseth / Diseño G.", estado: "EN_CURSO", porcentaje: 50, inicio: "2026-08-10", fin: "2026-08-12" },
      { numero: 35, nombre: "Aprobación y ajustes — certificado de autenticidad", responsable: "Luiseth / Diseño G.", estado: "EN_CURSO", porcentaje: 50, inicio: "2026-08-10", fin: "2026-08-12" },
      { numero: 36, nombre: "Producción del packaging restante", responsable: "MQS SAS", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-08-18", fin: "2026-09-08" },
      { numero: 37, nombre: "Cotizaciones", responsable: "Luis Cuellar", estado: "CERRADA", porcentaje: 100, inicio: "2026-07-20", fin: "2026-08-07" },
    ],
  },
  {
    nombre: "Legal",
    actividades: [
      { numero: 38, nombre: "T&C de cambios, garantías y devoluciones", responsable: "Legal", estado: "PENDIENTE", porcentaje: 0, inicio: "2026-08-13", fin: "2026-08-19" },
    ],
  },
];

async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? "Administrador";

  if (!email || !password) {
    console.warn(
      "SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD no están definidas: se omite la creación del usuario administrador."
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const { data: existing, error: findError } = await supabase
    .from(TABLES.user)
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (findError) throw new Error(findError.message);

  if (existing) {
    const { error } = await supabase.from(TABLES.user).update({ name, passwordHash }).eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from(TABLES.user)
      .insert({ id: randomUUID(), name, email, passwordHash, createdAt: new Date().toISOString() });
    if (error) throw new Error(error.message);
  }

  console.log(`Usuario administrador listo: ${email}`);
}

async function seedMateranProject() {
  const PROYECTO_ID = "materan-seed";
  const now = new Date().toISOString();

  const { data: existente, error: findError } = await supabase
    .from(TABLES.proyecto)
    .select("id")
    .eq("id", PROYECTO_ID)
    .maybeSingle();
  if (findError) throw new Error(findError.message);

  if (!existente) {
    const { error } = await supabase.from(TABLES.proyecto).insert({
      id: PROYECTO_ID,
      nombre: "MATERAN",
      descripcion: "Creación, expectativa y lanzamiento de marca",
      faseActual: "Creación, expectativa y lanzamiento de marca",
      fechaCorte: new Date("2026-08-11").toISOString(),
      createdAt: now,
      updatedAt: now,
    });
    if (error) throw new Error(error.message);
  }

  const { count, error: countError } = await supabase
    .from(TABLES.actividad)
    .select("*", { count: "exact", head: true })
    .eq("proyectoId", PROYECTO_ID);
  if (countError) throw new Error(countError.message);

  if ((count ?? 0) > 0) {
    console.log(`El proyecto MATERAN ya tiene ${count} actividades: se omite la carga inicial.`);
    return;
  }

  for (const [index, frenteSeed] of FRENTES.entries()) {
    const { data: frente, error: frenteError } = await supabase
      .from(TABLES.frente)
      .insert({ id: randomUUID(), nombre: frenteSeed.nombre, orden: index, proyectoId: PROYECTO_ID })
      .select("id")
      .single();
    if (frenteError) throw new Error(frenteError.message);

    const rows = frenteSeed.actividades.map((a) => ({
      id: randomUUID(),
      numero: a.numero,
      nombre: a.nombre,
      responsable: a.responsable,
      estado: a.estado,
      porcentaje: a.porcentaje,
      fechaInicio: new Date(a.inicio).toISOString(),
      fechaFin: new Date(a.fin).toISOString(),
      proyectoId: PROYECTO_ID,
      frenteId: frente.id,
      createdAt: now,
      updatedAt: now,
    }));

    const { error: actividadesError } = await supabase.from(TABLES.actividad).insert(rows);
    if (actividadesError) throw new Error(actividadesError.message);
  }

  console.log("Proyecto MATERAN sembrado con sus frentes y actividades.");
}

async function main() {
  await seedAdminUser();
  await seedMateranProject();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
