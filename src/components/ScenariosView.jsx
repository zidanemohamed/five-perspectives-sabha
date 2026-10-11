import React, { useState } from 'react';
import { BookOpen, Shield, Compass, Landmark, ArrowRight } from 'lucide-react';
import { SCENARIO_PRESETS } from '../utils/simulationEngine.js';
import { audioEngine } from '../utils/audioEngine.js';

export default function ScenariosView({ onSelectScenario }) {
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIO_PRESETS[0].id);

  const selected = SCENARIO_PRESETS.find(s => s.id === activeScenarioId) || SCENARIO_PRESETS[0];

  return (
    <div className="scenarios-view">
      <div className="vintage-card">
        <div className="vintage-card-header">
          <div className="vintage-card-title">
            <BookOpen size={16} color="#a8802f" />
            <span>Negotiation Scenarios & Diplomatic Case Studies</span>
          </div>
          <span className="vintage-badge">
            Mahabharata to Modern Conflict Resolution
          </span>
        </div>

        <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px', color: '#5c0f14', lineHeight: '1.6' }}>
          Explore historical and contemporary case studies where multi-party negotiations, asymmetric power, and the Four Upayas determine war or peace.
        </p>
      </div>

      {/* Scenario Selection Grid */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {SCENARIO_PRESETS.map((sc) => {
          const isCurrent = sc.id === activeScenarioId;
          return (
            <div 
              key={sc.id}
              onClick={() => {
                audioEngine.playParchmentSound();
                setActiveScenarioId(sc.id);
              }}
              style={{
                backgroundColor: isCurrent ? '#f6e3b0' : '#fdf7e6',
                border: isCurrent ? '1px solid #a8802f' : '1px solid #dcc58a',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="vintage-badge">
                  {sc.contextTag}
                </span>
                <span style={{ fontSize: '11px', color: '#a8802f', fontFamily: 'Cinzel' }}>
                  {sc.agents.length} AGENTS
                </span>
              </div>

              <h3 style={{ fontSize: '16px', color: isCurrent ? '#9a6f1f' : '#5c0f14', marginBottom: '6px' }}>
                {sc.name}
              </h3>
              <p style={{ fontSize: '12px', fontStyle: 'italic', fontFamily: 'Cormorant Garamond', color: '#a8802f', marginBottom: '10px' }}>
                "{sc.subtitle}"
              </p>
              <p style={{ fontSize: '13px', color: '#4a2a22', lineHeight: '1.5' }}>
                {sc.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Deep Dive Case Study Parchment */}
      <div className="parchment-scroll">
        <div style={{ borderBottom: '1px solid #d9c28a', paddingBottom: '12px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a5a3a', fontWeight: '700' }}>
              ACADEMIC CASE STUDY DOSSIER
            </span>
            <h2 style={{ fontSize: '22px', color: '#3a1014', marginTop: '4px' }}>
              {selected.name}
            </h2>
          </div>

          <button 
            className="vintage-btn primary"
            onClick={() => onSelectScenario(selected)}
          >
            <span>Load into Simulator</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid-2">
          <div>
            <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#4a2a22' }}>
              Strategic Core Issue & Territorial Stakes
            </h4>
            <p style={{ marginBottom: '14px' }}>
              <strong>Bargaining Subject:</strong> {selected.territoryIssue}
            </p>
            <p style={{ marginBottom: '14px' }}>
              <strong>Existential Stakes:</strong> {selected.stakes}
            </p>

            <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#4a2a22' }}>
              The Five Sacred Villages of Indraprastha
            </h4>
            <p style={{ fontSize: '15px' }}>
              When Krishna proposed the five villages—Panipat (Prasthaprastha), Sonipat (Sonaprastha), Baghpat (Vyaghraprastha), Tilpat (Tilaprastha), and Kutila/Indraprastha—he removed all material excuse for war. By asking for only five tiny tracts of land, the Pandavas demonstrated maximum concession willingness. Duryodhana’s refusal unmasked his absolute greed, proving to all neutral kingdoms that war was forced by Kaurava hubris rather than Pandava ambition.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#4a2a22' }}>
              Diplomatic Lessons for Modern Negotiators
            </h4>
            <ul style={{ listStyleType: 'square', paddingLeft: '20px', fontFamily: 'Cormorant Garamond', fontSize: '17px', color: '#3a1014', lineHeight: '1.6' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Establishing Moral High Ground (Dharma as Leverage):</strong> A concessionist anchor clarifies the moral dilemma for third-party stakeholders and allies.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>The Danger of Status-Driven Anchoring:</strong> Duryodhana’s infamous "needle point" declaration represents the classic trap where an actor values the appearance of dominance over physical survival.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Identity Trumps Material Incentives:</strong> In the overture to Karna, Krishna offered the highest material bribe possible (the imperial throne of Aryavarta). Yet Karna declined because his identity and moral debt to Duryodhana was sacred. Modern negotiators often fail when assuming all counterparts are purely transactional.
              </li>
              <li>
                <strong>BATNA Credibility:</strong> Krishna’s peace overture derived its formidable weight because his BATNA (the Pandava martial force) was devastatingly credible and fully mobilized.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
