import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(err: unknown, fallback = "Ocorreu um erro inesperado."): string {
  if (err instanceof Error) return err.message
  if (typeof err === "string") return err
  return fallback
}
