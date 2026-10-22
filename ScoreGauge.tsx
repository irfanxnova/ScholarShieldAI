import React from 'react';
import type { RiskLevel } from '../../types';

interface ScoreGaugeProps {
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  size?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, riskLevel, size = 180 }) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Draw an arc of 260 degrees (leaving 100 deg open at the bottom)
  const arcLength = circumference * (260 / 360);
  const strokeDashoffset = arcLength - (arcLength * Math.min(Math.max(score, 0), 100)) / 100;

  const colorConfig = {
    LOW: {
      color: '#059669',
      glow: 'rgba(5, 150, 105, 0.25)',
      label: 'MINIMAL RISK'
    },
    MEDIUM: {
      color: '#D97706',
      glow: 'rgba(217, 119, 6, 0.25)',
      label: 'SUSPICIOUS'
    },
    HIGH: {
      color: '#E11D48',
      glow: 'rgba(225, 29, 72, 0.3)',
      label: 'ELEVATED RISK'
    }
  }[riskLevel];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(140deg)' }}
          aria-hidden="true"
        >
          {/* Background track (Clean Pearl Slate) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Animated score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colorConfig.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.3, 1)',
              filter: `drop-shadow(0 2px 8px ${colorConfig.glow})`
            }}
          />
        </svg>

        {/* Center score readout */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '0.4rem'
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.8rem',
              fontWeight: 800,
              lineHeight: 1,
              color: 'var(--text-navy-deep)',
              letterSpacing: '-0.03em'
            }}
          >
            {score}
          </div>
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginTop: '0.2rem'
            }}
          >
            Out of 100
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '-0.6rem',
          fontSize: '0.78rem',
          fontWeight: 800,
          color: colorConfig.color,
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }}
      >
        {colorConfig.label}
      </div>
    </div>
  );
};
