import { DesignElement, CardData } from "../types/design";

export const generateTextShadow = (el: DesignElement): string => {
  if (el.depth > 0) {
    const depthShadows: string[] = [];
    for (let i = 1; i <= el.depth; i++) {
      depthShadows.push(`${i}px ${i}px 0 ${el.shadowColor}`);
    }
    depthShadows.push(
      `${el.depth + 2}px ${el.depth + 2}px 4px rgba(0,0,0,0.5)`,
    );
    return depthShadows.join(", ");
  }
  if (el.shadowX !== 0 || el.shadowY !== 0 || el.shadowBlur !== 0) {
    return `${el.shadowX}px ${el.shadowY}px ${el.shadowBlur}px ${el.shadowColor}`;
  }
  return "none";
};

export const generateTextStroke = (el: DesignElement): string | undefined => {
  if (el.strokeWidth && el.strokeWidth > 0) {
    return `${el.strokeWidth}px ${el.strokeColor || "#000000"}`;
  }
  return undefined;
};

export const sanitizeFilename = (name: string): string => {
  return name.replace(/[/\\?%*:|"<>]/g, "_").trim();
};

export const getCardFileName = (
  card: CardData | undefined,
  index: number,
  preferredColumn?: string,
): string => {
  if (!card) return `carta_${index + 1}`;

  if (preferredColumn && card[preferredColumn]) {
    const sanitized = sanitizeFilename(String(card[preferredColumn]));
    if (sanitized) return sanitized;
  }

  const candidates = [
    card.nome,
    card.Nome,
    card.name,
    card.Name,
    card.id,
    card.ID,
    card.Id,
    card.titulo,
    card.Titulo,
    card.title,
    card.Title,
  ];

  for (const candidate of candidates) {
    if (candidate) {
      const sanitized = sanitizeFilename(String(candidate));
      if (sanitized) return sanitized;
    }
  }

  // Se houver qualquer primeira coluna não-vazia
  const firstVal = Object.values(card).find((val) =>
    Boolean(val && String(val).trim()),
  );
  if (firstVal) {
    const sanitized = sanitizeFilename(String(firstVal).slice(0, 30));
    if (sanitized) return sanitized;
  }

  return `carta_${index + 1}`;
};
