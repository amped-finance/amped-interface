import React from 'react';
import './UpdateBanner.css';

export function UpdateBanner() {
  return (
    <div className="update-banner">
      <div className="update-banner-content">
        Sonic contracts have been re-deployed, see the announcement for more details &nbsp;
        <a 
          href="https://x.com/AmpedFinance/status/1891308056752869753" 
          target="_blank" 
          rel="noopener noreferrer"
          className="update-banner-link"
        >
          Read announcement
        </a>
      </div>
    </div>
  );
} 