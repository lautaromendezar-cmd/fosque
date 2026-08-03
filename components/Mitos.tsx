'use client';

import { useRef, useState } from 'react';

export type Mito = { q: string; a: string };

export default function Mitos({ mitos }: { mitos: Mito[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div>
      {mitos.map((m, i) => (
        <div key={i} className={`mito${open === i ? ' open' : ''}`}>
          <button
            className="q"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {m.q}
            <span className="ind">+</span>
          </button>
          <div
            className="a"
            ref={(el) => {
              refs.current[i] = el;
            }}
            style={{ maxHeight: open === i ? (refs.current[i]?.scrollHeight ?? 0) + 48 : 0 }}
          >
            <p>{m.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
