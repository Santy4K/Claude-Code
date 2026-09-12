interface SigilProps {
  size?: number;
  variant?: 'energy' | 'ash';
  className?: string;
}

export function Sigil({ size = 56, variant = 'energy', className }: SigilProps) {
  const stroke = variant === 'energy' ? '#8f6bff' : '#6a628a';
  const fill = variant === 'energy' ? 'rgba(143, 107, 255, 0.12)' : 'rgba(106, 98, 138, 0.1)';

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="28" cy="28" r="19" stroke={stroke} strokeWidth="1.4" fill={fill} />
      <rect
        x="28"
        y="14"
        width="19.8"
        height="19.8"
        transform="rotate(45 28 28)"
        stroke={stroke}
        strokeWidth="1.1"
        fill="none"
      />
      <circle cx="28" cy="28" r="2.4" fill={stroke} />
      <line x1="28" y1="2" x2="28" y2="9" stroke={stroke} strokeWidth="1.4" />
      <line x1="28" y1="47" x2="28" y2="54" stroke={stroke} strokeWidth="1.4" />
      <line x1="2" y1="28" x2="9" y2="28" stroke={stroke} strokeWidth="1.4" />
      <line x1="47" y1="28" x2="54" y2="28" stroke={stroke} strokeWidth="1.4" />
    </svg>
  );
}
