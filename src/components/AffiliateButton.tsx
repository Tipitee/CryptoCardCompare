import React from 'react';
import { ExternalLink } from 'lucide-react';
import { trackAffiliateClick } from '../utils/analytics';
import { getAffiliateLink } from '../utils/affiliateLink';

interface AffiliateButtonProps {
  card: { name: string; issuer: string; affiliateLink: string };
  lang: string;
  label: string;
  /** Where the click originates — used for analytics */
  source: Parameters<typeof trackAffiliateClick>[3];
  className?: string;
  showIcon?: boolean;
}

/**
 * Affiliate CTA button.
 * Always uses rel="sponsored noopener" per Google's link scheme guidelines.
 */
const AffiliateButton: React.FC<AffiliateButtonProps> = ({
  card,
  lang,
  label,
  source,
  className = 'btn-primary',
  showIcon = true,
}) => {
  const href = getAffiliateLink(card);
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener"
      className={className}
      onClick={() => trackAffiliateClick(card.name, card.issuer, href, source, lang)}
    >
      {label}
      {showIcon && <ExternalLink className="w-4 h-4" />}
    </a>
  );
};

export default AffiliateButton;
