import type { Chart, ScoreResult } from '../types';
import { explainChart } from '../lib/explain';

interface Props {
  chart: Chart;
  score: ScoreResult;
}

export default function ExplainPanel({ chart, score }: Props) {
  const ex = explainChart(chart, score);

  return (
    <div className="panel explain-panel">
      <h2>📖 白话详解</h2>
      <div className="explain-headline">{ex.headline}</div>

      {ex.blocks.map((b) => (
        <div className="explain-block" key={b.title}>
          <h4>
            {b.icon} {b.title}
          </h4>
          {b.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {b.bullets && b.bullets.length > 0 && (
            <ul className="explain-bullets">
              {b.bullets.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <details className="explain-glossary">
        <summary>📚 术语小词典（点开看解释）</summary>
        <div className="glossary-list">
          {ex.glossary.map((g) => (
            <div className="glossary-item" key={g.term}>
              <span className="glossary-term">{g.term}</span>
              <span className="glossary-mean">{g.meaning}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
