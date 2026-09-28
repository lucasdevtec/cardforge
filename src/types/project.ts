import { CardData, DesignElement } from "./design";

export interface ProjectSave {
  version: string;
  cardWidth: number;
  cardHeight: number;
  elements: DesignElement[];
  bgImage: string | null; // Guardará a imagem em base64
  bgColor?: string; // Cor de fundo do cartão (opcional)
  borderRadius?: number; // Raio da borda do cartão (opcional)
  csvData: CardData[];
  headers: string[];
}
