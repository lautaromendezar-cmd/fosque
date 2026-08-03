/**
 * Arcos concéntricos con gradiente, como en "USO DEL SISTEMA EN LOCALES"
 * del manual de marca. Decorativo, se posiciona con la prop className.
 */
export default function RingsDeco({
  id,
  from,
  to,
  className = '',
}: {
  id: string;
  from: string;
  to: string;
  className?: string;
}) {
  return (
    <svg className={`rings ${className}`.trim()} viewBox="0 0 220 220" aria-hidden="true">
      <defs>
        <linearGradient id={`rg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      {[30, 60, 90, 120, 150, 180].map((r) => (
        <circle
          key={r}
          cx="220"
          cy="220"
          r={r}
          fill="none"
          stroke={`url(#rg-${id})`}
          strokeWidth="9"
        />
      ))}
    </svg>
  );
}
