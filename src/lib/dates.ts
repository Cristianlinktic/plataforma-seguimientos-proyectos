import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Las fechas de actividades/proyectos se guardan como "solo fecha" (medianoche UTC).
 * date-fns lee los componentes en hora LOCAL del servidor, así que sin este ajuste
 * una fecha guardada como 2026-08-18 se vería como 17 de agosto en zonas UTC-N.
 * `dateOnly` reconstruye la fecha usando los componentes UTC para que el resto
 * del código (format, comparaciones de calendario, etc.) trabaje siempre con el
 * día calendario correcto sin importar la zona horaria del proceso.
 */
export function dateOnly(date: Date): Date {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function todayDateOnly(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatDateEs(date: Date, pattern: string): string {
  return format(dateOnly(date), pattern, { locale: es });
}
