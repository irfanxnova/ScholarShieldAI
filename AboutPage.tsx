import React from 'react';
import {
  AlertTriangle,
  Lock,
  Eye,
  FileCheck,
  GraduationCap,
  Scale
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Page Title */}
      <div>
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: 'var(--accent-violet)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}
        >
          Research & System Architecture
        </span>
        <h2 style={{ fontSize: '1.85rem', color: 'var(--text-navy-deep)', marginTop: '0.2rem' }}>
          About ScholarShield AI & Methodology
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem', maxWidth: '820px' }}>
          ScholarShield AI is an academic cybersecurity and threat assessment prototype designed to empower college students against predatory financial scams and identity harvesting.
        </p>
      </div>

      {/* Section 1: The Problem Space */}
      <div
        className="card"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          padding: '1.85rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-violet-subtle)',
              color: 'var(--accent-violet-dark)'
            }}
          >
            <GraduationCap size={22} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-navy-deep)' }}>
            The Student Threat Landscape
          </h3>
        </div>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          Undergraduate and graduate students represent an intensely targeted demographic for cyber deception syndicates. High academic stress, financial need, tuition inflation, and the competitive pressure to secure career internships create psychological vulnerabilities that adversaries exploit. Attackers pose as official university financial aid deans, corporate recruiters, and research faculty, crafting deceptive narratives that request upfront "processing fees" or harvest collegiate single-sign-on (SSO) credentials.
        </p>
      </div>

      {/* Section 2: Core Principles Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {/* Principle 1: Explainability */}
        <div
          className="card card-hover"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            padding: '1.6rem',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-teal)' }}>
            <Eye size={19} />
            <h4 style={{ fontSize: '1.08rem', color: 'var(--text-navy-deep)' }}>
              Explainable Risk Assessment
            </h4>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            Black-box machine learning models that generate opaque risk percentages without justification undermine educational trust. ScholarShield AI is built on <strong>explainability</strong>: every warning signal points directly to matching evidence in the text, explains the underlying adversary mechanism, and transparently details its numeric score contribution.
          </p>
        </div>

        {/* Principle 2: Signals vs Proof */}
        <div
          className="card card-hover"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            padding: '1.6rem',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-violet-dark)' }}>
            <Scale size={19} />
            <h4 style={{ fontSize: '1.08rem', color: 'var(--text-navy-deep)' }}>
              Signals vs. Confirmed Fraud
            </h4>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            ScholarShield AI acts as a <strong>preliminary risk assessment tool</strong>, not an infallible court of law. Warning signals are evidentiary indicators meant to provoke critical investigation. A legitimate institutional message might trigger an advisory if it includes unverified links or tight deadlines; similarly, novel scams might evade heuristic boundaries.
          </p>
        </div>

        {/* Principle 3: Zero-Data Exposure */}
        <div
          className="card card-hover"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            padding: '1.6rem',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)' }}>
            <Lock size={19} />
            <h4 style={{ fontSize: '1.08rem', color: 'var(--text-navy-deep)' }}>
              Safe Handling of Personal Data
            </h4>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            User message content is processed strictly in client-side memory. Submitted texts are never transmitted to third-party generative AI APIs, commercial cloud telemetry, or external tracking servers. Links extracted from messages are quarantined in inert plain text and never automatically fetched or traversed.
          </p>
        </div>

        {/* Principle 4: Official Verification */}
        <div
          className="card card-hover"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            padding: '1.6rem',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--risk-low)' }}>
            <FileCheck size={19} />
            <h4 style={{ fontSize: '1.08rem', color: 'var(--text-navy-deep)' }}>
              Out-of-Band Verification
            </h4>
          </div>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            Automated tools are an augmentation, not a replacement for authoritative institutional channels. Students are systematically guided to perform out-of-band verification: contacting their campus Financial Aid Director, consulting their Bursar, or checking internal university job portals.
          </p>
        </div>
      </div>

      {/* Section 3: Technical Limitations & Threat Scope */}
      <div
        className="card"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          padding: '1.85rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--risk-high-subtle)',
              color: 'var(--risk-high)'
            }}
          >
            <AlertTriangle size={20} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-navy-deep)' }}>
            System Scope & Analytical Limitations
          </h3>
        </div>

        <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <li style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            <strong>Text & Structural Link Heuristics Only:</strong> ScholarShield evaluates lexical tokens and observable URL structural patterns. It does not perform active network sandbox detonation, DNS record queries, or deep mail server reputation lookups.
          </li>
          <li style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            <strong>Adversarial Evasion:</strong> Malicious actors frequently modify wording, substitute unicode homoglyphs, or use image flyers to bypass text-based pattern recognition.
          </li>
          <li style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            <strong>No Endorsement or Cloud Certifications:</strong> This is an independent academic cybersecurity project. We do not claim commercial certifications, live dark web threat-intelligence feeds, or official government partnerships.
          </li>
        </ul>
      </div>
    </div>
  );
};
