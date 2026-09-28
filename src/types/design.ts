export type CardData = Record<string, string>;

export interface DesignElement {
  id: string;
  type: "variable" | "static" | "image"; // Adicionado "image"
  content: string; // Guardará o texto ou o Object URL da imagem
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  shadowColor: string;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  depth: number;
  rotation: number;
  width: number;
  height: number; // Adicionado para controlar o redimensionamento de imagens
  textAlign: "left" | "center" | "right" | "justify";
  opacity?: number; // 0 a 1
  strokeWidth?: number; // 0 a 10px
  strokeColor?: string; // cor do contorno
  letterSpacing?: number; // espaçamento de caracteres
  lineHeight?: number; // altura de linha
  borderRadius?: number; // arredondamento de bordas
}
