import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BrandMark } from './SiteHeader';

interface SiteFooterProps {
  onSwitchEra: (mode: '1900s' | '2020s') => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ onSwitchEra }) => {
  const visit = (mode: '1900s' | '2020s') => {
    onSwitchEra(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-master-footer">
      <div className="footer-contained-inner">
        <div className="footer-top-cluster">
          <p className="footer-brand-statement">
            A little pause. <em>A longer conversation.</em>
          </p>

          <div className="footer-columns">
            <div className="footer-col">
              <span className="footer-col-title">Visit an era</span>
              <button type="button" className="footer-era-link-btn" onClick={() => visit('1900s')}>
                I · The 1900s Adda <ArrowUpRight size={14} />
              </button>
              <button type="button" className="footer-era-link-btn" onClick={() => visit('2020s')}>
                II · The 2020s Café <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">At the counter</span>
              <a href="#menu">The menu</a>
              <a href="#ritual">How ordering works</a>
              <span>Pay by cash or UPI at pickup</span>
            </div>
          </div>
        </div>

        <div className="footer-wordmark" aria-hidden="true">
          <BrandMark />
          <span>Chaiwala</span>
        </div>

        <div className="footer-bottom-baseline">
          <span>Chaiwala Memory Club</span>
          <span>One counter · Everyone belongs</span>
          <span>© 2026 Chaiwala</span>
        </div>
      </div>
    </footer>
  );
};
