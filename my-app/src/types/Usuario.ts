export interface Usuario {
  // Propiedades en minúsculas (para compatibilidad y enviar al servidor)
  id?: string;
  nombre?: string;
  nombres?: string;
  apellidos?: string;
  numero?: string;
  email?: string;
  direccion?: string;
  pais?: string;
  estado?: string;
  ciudad?: string;
  id_pais?: number;
  id_provincia?: number;
  id_canton?: number;
  id_telefono?: number;
  id_domicilio?: number;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  tipoIdentificacion?: string;
  numeroIdentificacion?: string;
  estadoPersona?: string;
  tieneDiscapacidad?: string;
  tieneFamilDiscapacidad?: string;
  idNacionalidad?: number;
  version?: string;
  
  // Propiedades en MAYÚSCULAS (como vienen de DB2)
  ID?: string;
  NOMBRE?: string;
  NOMBRES?: string;
  APELLIDOS?: string;
  NUMERO?: string;
  EMAIL?: string;
  DIRECCION?: string;
  PAIS?: string;
  ESTADO?: string;
  CIUDAD?: string;
  ID_PAIS?: number;
  ID_PROVINCIA?: number;
  ID_CANTON?: number;
  ID_TELEFONO?: number;
  ID_DOMICILIO?: number;
  TIPOIDENTIFICACION?: string;
  NUMEROIDENTIFICACION?: string;
  ESTADOPERSONA?: string;
  TIENEDISCAPACIDAD?: string;
  TIENEFAMILDISCAPACIDAD?: string;
  IDNACIONALIDAD?: number;
  VERSION?: string;
}
