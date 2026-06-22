import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Home daily tip placement", () => {
  it("renderiza DailyTipCard antes do card de nível", () => {
    const source = readFileSync(resolve("src/pages/Home.tsx"), "utf8");
    const dailyTipPosition = source.indexOf("<DailyTipCard");
    const levelPosition = source.indexOf("Nível {level}");

    expect(dailyTipPosition).toBeGreaterThan(-1);
    expect(levelPosition).toBeGreaterThan(-1);
    expect(dailyTipPosition).toBeLessThan(levelPosition);
  });
});
