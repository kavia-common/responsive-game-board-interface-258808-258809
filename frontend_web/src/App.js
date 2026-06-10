import React, { useMemo, useState } from "react";

/**
 * Calculate the winner (if any) for a 3x3 tic tac toe board.
 * @param {(null|"X"|"O")[]} squares - Flat 9-length board.
 * @returns {{winner: (null|"X"|"O"), line: (null|number[])}} Winner and winning indices.
 */
function calculateWinner(squares) {
  const lines = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diags
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

/**
 * Make an empty board.
 * @returns {(null|"X"|"O")[]} A 9-length array of nulls.
 */
function createEmptyBoard() {
  return Array.from({ length: 9 }, () => null);
}

/**
 * A single square button on the board.
 * @param {object} props
 * @param {number} props.index
 * @param {null|"X"|"O"} props.value
 * @param {boolean} props.isWinningSquare
 * @param {boolean} props.disabled
 * @param {(index:number)=>void} props.onPlay
 */
function Square({ index, value, isWinningSquare, disabled, onPlay }) {
  const label = value
    ? `Square ${index + 1}, ${value}`
    : `Square ${index + 1}, empty`;

  return (
    <button
      type="button"
      className={[
        "square",
        value ? "square--filled" : "",
        isWinningSquare ? "square--win" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onPlay(index)}
      disabled={disabled}
      aria-label={label}
      aria-pressed={Boolean(value)}
    >
      <span className="squareMark" aria-hidden="true">
        {value || ""}
      </span>
    </button>
  );
}

/**
 * Board component (3x3 grid).
 * @param {object} props
 * @param {(null|"X"|"O")[]} props.squares
 * @param {(index:number)=>void} props.onPlay
 * @param {number[] | null} props.winningLine
 * @param {boolean} props.locked
 */
function Board({ squares, onPlay, winningLine, locked }) {
  const winningSet = useMemo(() => {
    if (!winningLine) return new Set();
    return new Set(winningLine);
  }, [winningLine]);

  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((value, i) => (
        <div className="boardCell" role="gridcell" key={i}>
          <Square
            index={i}
            value={value}
            isWinningSquare={winningSet.has(i)}
            disabled={locked || Boolean(value)}
            onPlay={onPlay}
          />
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /**
   * App entrypoint for the Tic Tac Toe frontend.
   * @returns {JSX.Element} The interactive Tic Tac Toe UI.
   */
  const [squares, setSquares] = useState(() => createEmptyBoard());
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);

  const isDraw = useMemo(() => {
    if (winner) return false;
    return squares.every((s) => s !== null);
  }, [squares, winner]);

  const currentPlayer = xIsNext ? "X" : "O";
  const gameOver = Boolean(winner) || isDraw;

  function handlePlay(index) {
    if (gameOver) return;
    if (squares[index]) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = currentPlayer;
      return next;
    });
    setXIsNext((v) => !v);
  }

  function handleNewGame() {
    setSquares(createEmptyBoard());
    setXIsNext(true);
  }

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
      ? "Draw game"
      : `Next player: ${currentPlayer}`;

  const statusSubtext = winner
    ? "Nice win. Start a new game to play again."
    : isDraw
      ? "No more moves left. Try a new game."
      : "Tap a square to place your mark.";

  return (
    <div className="app">
      <main className="card" role="main" aria-label="Tic Tac Toe">
        <header className="header">
          <div>
            <h1 className="title">Tic Tac Toe</h1>
            <p className="subtitle">Local two-player • responsive board</p>
          </div>

          <div className="status" aria-live="polite">
            <div className="statusTop">
              <span
                className={[
                  "statusPill",
                  winner
                    ? "statusPill--win"
                    : isDraw
                      ? "statusPill--draw"
                      : "statusPill--turn",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {statusText}
              </span>
            </div>
            <div className="statusBottom">{statusSubtext}</div>
          </div>
        </header>

        <section className="game" aria-label="Game">
          <Board squares={squares} onPlay={handlePlay} winningLine={line} locked={gameOver} />

          <div className="controls" aria-label="Game controls">
            <button type="button" className="btn btnPrimary" onClick={handleNewGame}>
              New game
            </button>

            <div className="meta" aria-label="Rules">
              <div className="metaRow">
                <span className="metaLabel">You are playing:</span>
                <span className="metaValue">
                  <span className="mark markX" aria-label="X">
                    X
                  </span>
                  <span className="metaSep">and</span>
                  <span className="mark markO" aria-label="O">
                    O
                  </span>
                </span>
              </div>
              <div className="metaRow">
                <span className="metaLabel">Tip:</span>
                <span className="metaValue">Winning line highlights in blue.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="env" aria-label="Environment">
          <h2 className="sectionTitle">Environment</h2>
          <dl className="envGrid">
            <div>
              <dt>REACT_APP_API_BASE</dt>
              <dd>{process.env.REACT_APP_API_BASE || "(not set)"}</dd>
            </div>
            <div>
              <dt>REACT_APP_BACKEND_URL</dt>
              <dd>{process.env.REACT_APP_BACKEND_URL || "(not set)"}</dd>
            </div>
            <div>
              <dt>REACT_APP_WS_URL</dt>
              <dd>{process.env.REACT_APP_WS_URL || "(not set)"}</dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}
