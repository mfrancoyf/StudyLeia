export type TipoEvento = "PROVA" | "TRABALHO" | "APRESENTACAO" | "LEMBRETE";

export interface EventRequest {
  titulo: string;
  tipo: TipoEvento;
  dataHora: string;
  descricao: string;
}

export interface EventResponse {
  id: string;
  titulo: string;
  tipo: TipoEvento;
  dataHora: string;
  descricao: string;
  diasRestantes: number;
}
