import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DailyTipCard } from "@/components/DailyTipCard";

describe("DailyTipCard", () => {
  it("mostra título, dica e gatinha professora", () => {
    render(<DailyTipCard tip="Use contexto antes do pedido." />);

    expect(
      screen.getByRole("heading", { name: "Dica do dia" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Use contexto antes do pedido."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "Gatinha professora dando a dica do dia",
      }),
    ).toHaveAttribute("src", "/assets/mascot-teacher.png");
  });
});
