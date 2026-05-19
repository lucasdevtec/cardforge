import { DesignElement } from "../types/design";

export const generateTextShadow = (el: DesignElement): string => {
  if (el.depth > 0) {
    const depthShadows = [];
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
