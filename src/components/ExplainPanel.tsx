import { useState } from 'react';
import type { Chart, ScoreResult } from '../types';
import { explainChart, type Persona } from '../lib/explain';

interface Props {
  chart: Chart;
  score: ScoreResult;
  persona?: Persona;
}

export default function ExplainPanel({ chart, score, persona = 'neutral' }: Props) {
  const ex = explainChart(chart, score, persona);
  const [avatarMissing, setAvatarMissing] = useState(false);
  const whale = ex.voice === 'whale';

  return (
    <div className={`panel explain-panel${whale ? ' whale-voice' : ''}`}>
      {whale ? (
        <div className="explain-voice-head">
          {!avatarMissing && (
            <img
              className="explain-avatar"
              src="./whale-mascot.webp"
              alt="鲸鱼娘"
              onError={() => setAvatarMissing(true)}
            />
          )}
          <div>
            <div className="explain-voice-name">{ex.personaName}</div>
            <div className="muted small">{ex.personaTagline}</div>
          </div>
        </div>
      ) : (
        <h2>📖 白话详解</h2>
      )}

      <div className="explain-headline">{ex.headline}</div>

      {ex.blocks.map((b) => (
        <div className="explain-block" key={b.key}>
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
          {whale && b.quip && <div className="explain-quip">🐋 {b.quip}</div>}
        </div>
      ))}

      <details className="explain-glossary">
        <summary>{whale ? '📚 术语小词典（看不懂的字儿点这儿）' : '📚 术语小词典（点开看解释）'}</summary>
        <div className="glossary-list">
          {ex.glossary.map((g) => (
            <div className="glossary-item" key={g.term}>
              <span className="glossary-term">{g.term}</span>
              <span className="glossary-mean">{g.meaning}</span>
            </div>
          ))}
        </div>
      </details>

      {whale && ex.signoff && <div className="explain-signoff">{ex.signoff}</div>}
    </div>
  );
}
