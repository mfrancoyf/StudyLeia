export type TipoItemCronograma = "ESTUDO" | "REVISAO" | "SIMULADO";

export interface GerarPlanoEstudosRequest {
  materia: string;
  dataProva: string; // ISO date, deve ser no futuro
  horasDisponiveisPorDia: number; // >= 0.5
}

export interface StudyPlanItemResponse {
  id: string;
  data: string;
  assunto: string;
  tipo: TipoItemCronograma;
  descricao: string;
  concluido: boolean;
}

export interface StudyPlanResponse {
  id: string;
  materia: string;
  dataProva: string;
  horasDisponiveisPorDia: number;
  resumo: string;
  concluido: boolean;
  percentualConcluido: number;
  itens: StudyPlanItemResponse[];
}

export interface StudyPlanResumoResponse {
  id: string;
  materia: string;
  dataProva: string;
  concluido: boolean;
  percentualConcluido: number;
  totalItens: number;
}
