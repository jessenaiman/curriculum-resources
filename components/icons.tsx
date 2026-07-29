const common = { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function IntroduceIcon() {
  return (
    <svg {...common} aria-hidden="true">
      <path d="M12 3v2M4.2 5.2l1.4 1.4M19.8 5.2l-1.4 1.4M3 12h2M19 12h2" />
      <path d="M9 16.5a4.5 4.5 0 1 1 6 0c-.6.55-1 1.3-1 2.1v.4H10v-.4c0-.8-.4-1.55-1-2.1Z" />
      <path d="M10 21.5h4" />
    </svg>
  );
}

function TeachIcon() {
  return (
    <svg {...common} aria-hidden="true">
      <circle cx="8.5" cy="8" r="2.5" />
      <circle cx="16" cy="9" r="2" />
      <path d="M3.5 19c.5-3 2.4-4.6 5-4.6s4.5 1.6 5 4.6" />
      <path d="M14 19c.35-2.1 1.6-3.4 3.5-3.4s3 1.2 3.5 3.2" />
    </svg>
  );
}

function PracticeIcon() {
  return (
    <svg {...common} aria-hidden="true">
      <path d="m14.5 4.5 5 5L8 21l-5 1 1-5Z" />
      <path d="m13 6 5 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg {...common} aria-hidden="true">
      <rect x="4" y="3.5" width="16" height="17" rx="2" />
      <path d="M8 3v2.2M16 3v2.2" />
      <path d="m8.5 13 2.3 2.3L15.8 10" />
    </svg>
  );
}

function GenericStepIcon() {
  return (
    <svg {...common} aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}

export function StepIcon({ label }: { label: string }) {
  const key = label.toLowerCase();
  if (key.includes("introduce")) return <IntroduceIcon />;
  if (key.includes("teach")) return <TeachIcon />;
  if (key.includes("practice")) return <PracticeIcon />;
  if (key.includes("check")) return <CheckIcon />;
  return <GenericStepIcon />;
}
