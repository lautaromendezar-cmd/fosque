import { ISO_D, ISO_VB, WORD_D, WORD_VB } from './paths';

/** Isologo F oficial (vectorizado del manual). Hereda color via currentColor. */
export function LogoIso({ height = 32 }: { height?: number }) {
  return (
    <svg viewBox={ISO_VB} style={{ height, width: 'auto', display: 'block' }} aria-hidden="true">
      <path d={ISO_D} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

/** Wordmark FOSQUE oficial (nunca tipografiado, como pide el manual). */
export function LogoWord({ height = 14 }: { height?: number }) {
  return (
    <svg viewBox={WORD_VB} style={{ height, width: 'auto', display: 'block' }} aria-hidden="true">
      <path d={WORD_D} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

/** Lockup horizontal iso + wordmark para nav y footer. */
export default function Logo({
  iso = 30,
  word = 13,
}: {
  iso?: number;
  word?: number;
}) {
  return (
    <span className="logo-lockup">
      <LogoIso height={iso} />
      <LogoWord height={word} />
      <span className="sr-only">FOSQUE</span>
    </span>
  );
}
