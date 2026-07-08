export type HumorPet = "TRISTE" | "ENTEDIADA" | "NEUTRA" | "FELIZ" | "SUPER_FELIZ";

export type EstagioEvolucao = "FILHOTE" | "JOVEM" | "ADULTA" | "SABIA" | "RAINHA_LEIA";

export interface PetStatusResponse {
  nomePet: string;
  humor: HumorPet;
  estagioEvolucao: EstagioEvolucao;
  totalCarinhos?: number;
}
