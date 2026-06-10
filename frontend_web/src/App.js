import React from "react";

/**
 * App shell for the Tic Tac Toe frontend.
 * Game UI and logic are implemented in later plan steps.
 */
export default function App() {
  return (
    <div className="app">
      <main className="card" role="main" aria-label="Tic Tac Toe">
        <h1 className="title">Tic Tac Toe</h1>
        <p className="subtitle">Scaffold complete. Game UI comes next.</p>

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
