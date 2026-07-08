export interface NoteRequest {
  titulo: string;
  conteudo: string;
  categoria: string;
  tags: string[];
}

export interface NoteResponse {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  tags: string[];
  criadoEm: string;
  atualizadoEm: string;
}
