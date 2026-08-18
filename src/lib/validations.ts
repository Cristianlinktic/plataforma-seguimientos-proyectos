import * as z from "zod";

export const LoginSchema = z.object({
  email: z.email({ error: "Ingresa un correo válido." }),
  password: z.string().min(1, { error: "Ingresa tu contraseña." }),
});

export const EstadoActividadEnum = z.enum(["PENDIENTE", "EN_CURSO", "CERRADA"]);

export const ProyectoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, { error: "El nombre debe tener al menos 2 caracteres." })
    .max(120, { error: "El nombre es demasiado largo." }),
  descripcion: z
    .string()
    .trim()
    .max(500, { error: "La descripción es demasiado larga." })
    .optional()
    .or(z.literal("")),
  faseActual: z
    .string()
    .trim()
    .max(200, { error: "La fase es demasiado larga." })
    .optional()
    .or(z.literal("")),
  fechaCorte: z
    .string()
    .optional()
    .or(z.literal("")),
});

export const FrenteSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, { error: "El nombre del frente debe tener al menos 2 caracteres." })
    .max(80, { error: "El nombre del frente es demasiado largo." }),
});

export const ActividadSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(2, { error: "El nombre de la actividad debe tener al menos 2 caracteres." })
      .max(200, { error: "El nombre es demasiado largo." }),
    responsable: z
      .string()
      .trim()
      .min(2, { error: "Indica quién es el responsable." })
      .max(120, { error: "El responsable es demasiado largo." }),
    estado: EstadoActividadEnum,
    porcentaje: z.coerce
      .number()
      .int()
      .min(0, { error: "El % de avance no puede ser negativo." })
      .max(100, { error: "El % de avance no puede superar 100." }),
    fechaInicio: z.string().min(1, { error: "Indica la fecha de inicio." }),
    fechaFin: z.string().min(1, { error: "Indica la fecha de fin." }),
    frenteId: z.string().optional().or(z.literal("")),
  })
  .refine((data) => new Date(data.fechaFin) >= new Date(data.fechaInicio), {
    error: "La fecha de fin no puede ser anterior a la fecha de inicio.",
    path: ["fechaFin"],
  });

export const UsuarioSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "El nombre debe tener al menos 2 caracteres." })
    .max(120, { error: "El nombre es demasiado largo." }),
  email: z.email({ error: "Ingresa un correo válido." }).trim(),
  password: z
    .string()
    .min(8, { error: "La contraseña debe tener al menos 8 caracteres." })
    .max(72, { error: "La contraseña es demasiado larga." }),
});

export type ProyectoInput = z.infer<typeof ProyectoSchema>;
export type FrenteInput = z.infer<typeof FrenteSchema>;
export type ActividadInput = z.infer<typeof ActividadSchema>;
export type UsuarioInput = z.infer<typeof UsuarioSchema>;
