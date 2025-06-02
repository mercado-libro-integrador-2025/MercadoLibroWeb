// contacto.models.ts
export interface Contacto {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}
