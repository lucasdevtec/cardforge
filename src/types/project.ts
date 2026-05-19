import { CardData, DesignElement } from "./design";

export interface ProjectSave {
  version: string;
  cardWidth: number;
  cardHeight: number;
  elements: DesignElement[];
  bgImage: string | null; // Guardará a imagem em base64
  csvData: CardData[];
  headers: string[];
}
