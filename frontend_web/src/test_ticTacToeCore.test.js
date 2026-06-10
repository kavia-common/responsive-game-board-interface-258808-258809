import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

/**
 * Helper: click a square by its 1-based index using the app's aria-labels.
 * App labels are: "Square N, empty" (and later "Square N, X/O").
 */
async function clickSquare(user, index1Based) {
  const btn = screen.getByRole("button", { name: `Square ${index1Based}, empty` });
  await user.click(btn);
}

describe("Tic Tac Toe core gameplay", () => {
  test("initial render shows next player X and an empty board", () => {
    render(<App />);

    expect(screen.getByText("Tic Tac Toe")).toBeInTheDocument();
    expect(screen.getByText("Next player: X")).toBeInTheDocument();

    // 9 empty squares should be present.
    for (let i = 1; i <= 9; i += 1) {
      expect(
        screen.getByRole("button", { name: `Square ${i}, empty` })
      ).toBeInTheDocument();
    }
  });

  test("alternates turns: first move is X, second is O", async () => {
    const user = userEvent.setup();
    render(<App />);

    await clickSquare(user, 1);
    expect(screen.getByText("Next player: O")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Square 1, X" })).toBeDisabled();

    await clickSquare(user, 2);
    expect(screen.getByText("Next player: X")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Square 2, O" })).toBeDisabled();
  });

  test("detects a winner (X) and locks the board after game over", async () => {
    const user = userEvent.setup();
    render(<App />);

    // X wins on the top row: squares 1,2,3
    // X:1, O:4, X:2, O:5, X:3
    await clickSquare(user, 1);
    await clickSquare(user, 4);
    await clickSquare(user, 2);
    await clickSquare(user, 5);
    await clickSquare(user, 3);

    expect(screen.getByText("Winner: X")).toBeInTheDocument();
    expect(
      screen.getByText("Nice win. Start a new game to play again.")
    ).toBeInTheDocument();

    // After a win, remaining empty squares should be disabled (board locked).
    // Squares 6-9 remain empty here.
    for (const i of [6, 7, 8, 9]) {
      expect(screen.getByRole("button", { name: `Square ${i}, empty` })).toBeDisabled();
    }
  });

  test("New game resets the board and status", async () => {
    const user = userEvent.setup();
    render(<App />);

    await clickSquare(user, 1);
    await clickSquare(user, 4);
    await clickSquare(user, 2);
    await clickSquare(user, 5);
    await clickSquare(user, 3);

    expect(screen.getByText("Winner: X")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /new game/i }));

    expect(screen.getByText("Next player: X")).toBeInTheDocument();

    // Square 1 should be empty again and enabled.
    const square1 = screen.getByRole("button", { name: "Square 1, empty" });
    expect(square1).toBeEnabled();
  });
});
