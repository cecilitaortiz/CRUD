export interface Usuario {
  id: string;
  nombre: string;
  numero: string;
  email: string;
  direccion : string;
  pais?: string;
  estado?: string;
  ciudad?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
