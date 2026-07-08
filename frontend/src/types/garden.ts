export type TipoPlanta = "FLOR_AZUL" | "GIRASSOL" | "ROSA" | "LAVANDA";
export type EstagioCrescimento = "SEMENTE" | "BROTO" | "CRESCENDO" | "FLORESCIDA";

export interface PlantarRequest {
  tipo: TipoPlanta;
  posicaoVaso: number; // 0-11
}

export interface PlantaResponse {
  id: string;
  posicaoVaso: number;
  tipo: TipoPlanta;
  nomeExibicao: string;
  estagio: EstagioCrescimento;
  progressoPercentual: number;
  colhida: boolean;
}

export interface GardenResponse {
  sementes: number;
  totalFloresColhidas: number;
  plantas: PlantaResponse[];
}
