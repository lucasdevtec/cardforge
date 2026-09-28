import { describe, it, expect } from "vitest";
import {
  generateTextShadow,
  generateTextStroke,
  sanitizeFilename,
  getCardFileName,
} from "./textEffects";
import { DesignElement, CardData } from "../types/design";

describe("textEffects", () => {
  const baseElement: DesignElement = {
    id: "test-1",
    type: "static",
    content: "Texto Teste",
    x: 10,
    y: 10,
    fontSize: 20,
    color: "#ffffff",
    fontFamily: "Arial",
    fontWeight: "normal",
    fontStyle: "normal",
    shadowColor: "#ff0000",
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 0,
    depth: 0,
    rotation: 0,
    width: 200,
    height: 50,
    textAlign: "center",
  };

  it("should return 'none' when no shadow is defined", () => {
    expect(generateTextShadow(baseElement)).toBe("none");
  });

  it("should generate simple text shadow", () => {
    const el = {
      ...baseElement,
      shadowX: 2,
      shadowY: 3,
      shadowBlur: 4,
      shadowColor: "#000000",
    };
    expect(generateTextShadow(el)).toBe("2px 3px 4px #000000");
  });

  it("should generate 3D depth shadows", () => {
    const el = { ...baseElement, depth: 3, shadowColor: "#333333" };
    const shadow = generateTextShadow(el);
    expect(shadow).toContain("1px 1px 0 #333333");
    expect(shadow).toContain("2px 2px 0 #333333");
    expect(shadow).toContain("3px 3px 0 #333333");
    expect(shadow).toContain("5px 5px 4px rgba(0,0,0,0.5)");
  });

  it("should generate text stroke", () => {
    expect(generateTextStroke(baseElement)).toBeUndefined();
    const elWithStroke = {
      ...baseElement,
      strokeWidth: 2,
      strokeColor: "#000000",
    };
    expect(generateTextStroke(elWithStroke)).toBe("2px #000000");
  });

  it("should sanitize filenames properly", () => {
    expect(sanitizeFilename("carta/com:caracteres*invalidos?")).toBe(
      "carta_com_caracteres_invalidos_",
    );
    expect(sanitizeFilename("  minha_carta  ")).toBe("minha_carta");
  });

  it("should extract card filename with fallback", () => {
    const cardWithId: CardData = { ID: "G-001", Desafio: "Pergunta" };
    expect(getCardFileName(cardWithId, 0)).toBe("G-001");

    const cardWithName: CardData = { nome: "Cavaleiro Negro" };
    expect(getCardFileName(cardWithName, 1)).toBe("Cavaleiro Negro");

    const cardWithPreferredCol: CardData = { ID: "001", Nivel: "Ouro" };
    expect(getCardFileName(cardWithPreferredCol, 2, "Nivel")).toBe("Ouro");

    expect(getCardFileName(undefined, 3)).toBe("carta_4");
  });
});
