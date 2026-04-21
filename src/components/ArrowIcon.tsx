export default function ArrowIcon({ className = "arr arr-svg" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 7h8m0 0-3-3m3 3-3 3"/>
    </svg>
  );
}
