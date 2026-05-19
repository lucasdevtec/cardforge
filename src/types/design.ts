export type CardData = Record<string, string>;

export interface DesignElement {
  id: string;
  type: "variable" | "static";
  content: string;
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
}
