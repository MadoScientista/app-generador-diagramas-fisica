import { useState, type ReactNode } from 'react';

interface CollapsibleCardProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsibleCard({ title, defaultOpen = true, children }: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`collapsible-card${isOpen ? ' open' : ''}`}>
      <button
        type="button"
        className="collapsible-card-header"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <span className={`chevron${isOpen ? ' open' : ''}`}>&#9660;</span>
      </button>
      {isOpen && (
        <div className="collapsible-card-body">
          {children}
        </div>
      )}
    </div>
  );
}
