import React from 'react';

interface EraSwitcherProps {
  eraMode: '1900s' | '2020s';
  onSwitchEra: (mode: '1900s' | '2020s') => void;
}

const ERAS = [
  { mode: '1900s', numeral: 'I', name: 'The Adda', year: '1900s' },
  { mode: '2020s', numeral: 'II', name: 'The Café', year: '2020s' },
] as const;

export const EraSwitcher: React.FC<EraSwitcherProps> = ({ eraMode, onSwitchEra }) => (
  <div className="segmented-era-switcher" role="group" aria-label="Choose an era">
    {ERAS.map((era) => (
      <button
        key={era.mode}
        type="button"
        className={`era-switch-pill ${eraMode === era.mode ? 'active' : ''}`}
        onClick={() => onSwitchEra(era.mode)}
        aria-pressed={eraMode === era.mode}
      >
        <span className="era-switch-numeral">{era.numeral}</span>
        <span className="era-switch-text">
          <span className="era-switch-name">{era.name}</span>
          <span className="era-switch-year">{era.year}</span>
        </span>
      </button>
    ))}
  </div>
);
