import React, { useEffect, useRef, useState } from 'react';

interface SaasTooltipProps {
  label: string;
  shortcut?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export const SaasTooltip: React.FC<SaasTooltipProps> = ({
  label,
  shortcut,
  children,
  position = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    // 200ms delay before triggering reveal
    timerRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className="saas-tooltip-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className={`saas-tooltip-bubble bubble-${position}`} role="tooltip">
          <span className="tooltip-label">{label}</span>
          {shortcut && <kbd className="tooltip-shortcut">{shortcut}</kbd>}
          <span className="tooltip-caret" />
        </div>
      )}
    </div>
  );
};

