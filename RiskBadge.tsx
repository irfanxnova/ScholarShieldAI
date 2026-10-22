import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showIcon = true }) => {
  const config = {
    LOW: {
      label: 'Low Risk',
      badgeClass: 'badge-low',
      Icon: ShieldCheck
    },
    MEDIUM: {
      label: 'Medium Risk',
      badgeClass: 'badge-medium',
      Icon: AlertTriangle
    },
    HIGH: {
      label: 'High Risk',
      badgeClass: 'badge-high',
      Icon: ShieldAlert
    }
  }[level];

  const sizeClasses = {
    sm: { padding: '0.2rem 0.5rem', fontSize: '0.68rem', iconSize: 12 },
    md: { padding: '0.25rem 0.65rem', fontSize: '0.74rem', iconSize: 14 },
    lg: { padding: '0.4rem 0.9rem', fontSize: '0.85rem', iconSize: 17 }
  }[size];

  const { Icon } = config;

  return (
    <span
      className={`badge ${config.badgeClass}`}
      style={{
        padding: sizeClasses.padding,
        fontSize: sizeClasses.fontSize
      }}
      role="status"
      aria-label={`Risk classification: ${config.label}`}
    >
      {showIcon && <Icon size={sizeClasses.iconSize} strokeWidth={2.4} aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
};
