export interface PontoSerieTemporal {
  rotulo: string;
  valor: number;
}

export interface EstatisticaPorTema {
  tema: string;
  totalRespondidas: number;
  totalCorretas: number;
  taxaAcerto: number;
}

export interface StatisticsResponse {
  totalHorasEstudadas: number;
  xpAcumulado: number;
  totalQuestoesRespondidas: number;
  totalQuestoesCorretas: number;
  taxaAcertoGeral: number;
  sequenciaAtual: number;
  maiorSequencia: number;
  diasAtivos: number;
  xpPorSemana: PontoSerieTemporal[];
  xpPorMes: PontoSerieTemporal[];
  atividadeSemanal: PontoSerieTemporal[];
  atividadeMensal: PontoSerieTemporal[];
  acertosPorMateria: EstatisticaPorTema[];
  materiasMaisEstudadas: EstatisticaPorTema[];
  materiasMenosEstudadas: EstatisticaPorTema[];
}
