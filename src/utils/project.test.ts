import { describe, it, expect } from "vitest";
import { DesignElement, CardData } from "../types/design";
import { ProjectSave } from "../types/project";
import { getCardFileName } from "./textEffects";

describe("Project and Layer Operations", () => {
  const createElement = (id: string, content: string): DesignElement => ({
    id,
    type: "static",
    content,
    x: 0,
    y: 0,
    fontSize: 20,
    color: "#000000",
    fontFamily: "Arial",
    fontWeight: "normal",
    fontStyle: "normal",
    shadowColor: "#000000",
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 0,
    depth: 0,
    rotation: 0,
    width: 100,
    height: 40,
    textAlign: "center",
  });

  it("should reorder layers with bringToFront and sendToBack", () => {
    const el1 = createElement("1", "Primeiro");
    const el2 = createElement("2", "Segundo");
    const el3 = createElement("3", "Terceiro");
    let elements = [el1, el2, el3];

    // Trazer el1 para frente (fim do array)
    const bringToFront = (list: DesignElement[], id: string) => {
      const item = list.find((el) => el.id === id);
      if (!item) return list;
      return [...list.filter((el) => el.id !== id), item];
    };

    elements = bringToFront(elements, "1");
    expect(elements.map((e) => e.id)).toEqual(["2", "3", "1"]);

    // Enviar el1 para trás (início do array)
    const sendToBack = (list: DesignElement[], id: string) => {
      const item = list.find((el) => el.id === id);
      if (!item) return list;
      return [item, ...list.filter((el) => el.id !== id)];
    };

    elements = sendToBack(elements, "1");
    expect(elements.map((e) => e.id)).toEqual(["1", "2", "3"]);
  });

  it("should step layers up and down", () => {
    const el1 = createElement("1", "A");
    const el2 = createElement("2", "B");
    const el3 = createElement("3", "C");
    const elements = [el1, el2, el3];

    const moveLayerUp = (list: DesignElement[], id: string) => {
      const index = list.findIndex((el) => el.id === id);
      if (index === -1 || index === list.length - 1) return list;
      const copy = [...list];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    };

    const movedUp = moveLayerUp(elements, "1");
    expect(movedUp.map((e) => e.id)).toEqual(["2", "1", "3"]);

    const moveLayerDown = (list: DesignElement[], id: string) => {
      const index = list.findIndex((el) => el.id === id);
      if (index <= 0) return list;
      const copy = [...list];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    };

    const movedDown = moveLayerDown(movedUp, "1");
    expect(movedDown.map((e) => e.id)).toEqual(["1", "2", "3"]);
  });

  it("should correctly serialize and deserialize ProjectSave payload", () => {
    const project: ProjectSave = {
      version: "1.0.0",
      cardWidth: 400,
      cardHeight: 560,
      bgColor: "#ffffff",
      borderRadius: 8,
      bgImage: "data:image/png;base64,mock",
      elements: [createElement("el-1", "Titulo")],
      csvData: [{ ID: "001", Nome: "Carta Alfa" }],
      headers: ["ID", "Nome"],
    };

    const serialized = JSON.stringify(project);
    const parsed: ProjectSave = JSON.parse(serialized);

    expect(parsed.version).toBe("1.0.0");
    expect(parsed.cardWidth).toBe(400);
    expect(parsed.cardHeight).toBe(560);
    expect(parsed.elements.length).toBe(1);
    expect(parsed.elements[0].content).toBe("Titulo");
    expect(parsed.csvData.length).toBe(1);
    expect(parsed.headers).toEqual(["ID", "Nome"]);
  });

  it("should extract card filename with custom filenameColumn", () => {
    const card: CardData = {
      ID: "G-99",
      Titulo: "Missão Espacial",
      Raridade: "Lendária",
    };

    expect(getCardFileName(card, 0, "Titulo")).toBe("Missão Espacial");
    expect(getCardFileName(card, 0, "Raridade")).toBe("Lendária");
    expect(getCardFileName(card, 0)).toBe("G-99");
  });

  it("should handle undo and redo stack transitions correctly", () => {
    let past: DesignElement[][] = [];
    let present: DesignElement[] = [];
    let future: DesignElement[][] = [];

    // Ação 1: Adicionar el1
    const el1 = createElement("1", "Primeiro");
    past = [...past, present];
    present = [el1];
    future = [];

    expect(present.length).toBe(1);
    expect(past.length).toBe(1);

    // Ação 2: Adicionar el2
    const el2 = createElement("2", "Segundo");
    past = [...past, present];
    present = [el1, el2];
    future = [];

    expect(present.length).toBe(2);
    expect(past.length).toBe(2);

    // Desfazer (Undo 1): volta para [el1]
    const undo = () => {
      if (past.length === 0) return;
      const previous = past[past.length - 1];
      future = [present, ...future];
      present = previous;
      past = past.slice(0, past.length - 1);
    };

    undo();
    expect(present.length).toBe(1);
    expect(present[0].id).toBe("1");
    expect(future.length).toBe(1);

    // Refazer (Redo): volta para [el1, el2]
    const redo = () => {
      if (future.length === 0) return;
      const next = future[0];
      past = [...past, present];
      present = next;
      future = future.slice(1);
    };

    redo();
    expect(present.length).toBe(2);
    expect(past.length).toBe(2);
    expect(future.length).toBe(0);
  });
});
