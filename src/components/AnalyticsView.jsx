import React, { useState } from 'react';
import { Award, ShieldAlert, BarChart3, TrendingUp, Sliders, CheckCircle2, XCircle } from 'lucide-react';
import ParetoChart from './ParetoChart.jsx';
import { audioEngine } from '../utils/audioEngine.js';

export default function AnalyticsView() {
  const [egoFactor, setEgoFactor] = useState(85);
  const [desperationFactor, setDesperationFactor] = useState(70);
  const [mediatorPrestige, setMediatorPrestige] = useState(90);

  // Computed game theoretic model variables
  const computedEscalation = Math.min(100, Math.max(10, Math.round(egoFactor * 0.8 + (100 - mediatorPrestige) * 0.4)));
  const computedAgreementRate = Math.max(0, Math.min(100, Math.round((100 - egoFactor) * 0.65 + mediatorPrestige * 0.35 - (100 - desperationFactor) * 0.1)));
  const isParetoPossible = computedAgreementRate >= 25;

  return (
    <div className="analytics-view">
      {/* Title & Introduction */}
      <div className="vintage-card">
        <div className="vintage-card-header">
          <div className="vintage-card-title">
            <Award size={16} color="#a8802f" />
            <span>Game Theory & Strategic Conflict Resolution Model</span>
          </div>
          <span className="vintage-badge">
            Mahabharata Mathematical Modeling
          </span>
        </div>

        <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px', color: '#5c0f14', lineHeight: '1.6' }}>
          In classical game theory, Krishna’s embassy to Hastinapura represents an asymmetric non-zero-sum coordination game. 
          The Pandavas offered a radical concession (The Five Villages), deliberately shifting the negotiation to the Pareto efficient frontier. 
          Duryodhana’s subsequent refusal exemplifies how status-driven ego and distorted BATNA valuation trap rational actors in catastrophic Nash equilibria.
        </p>
      </div>

      {/* Grid: 2x2 Payoff Matrix & Upaya Radar */}
      <div className="grid-2">
        {/* The Hastinapura Strategic Payoff Matrix */}
        <div className="vintage-card">
          <div className="vintage-card-header">
            <div className="vintage-card-title">
              <BarChart3 size={16} color="#a8802f" />
              <span>Hastinapura Strategic Payoff Matrix (Normal Form)</span>
            </div>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #dcc58a', color: '#8a6a4a' }}>PANDAVA \ KAURAVA</th>
                  <th style={{ padding: '10px', border: '1px solid #dcc58a', color: '#2f6b3b', fontFamily: 'Cinzel' }}>CONCEDE (5 Villages Peace)</th>
                  <th style={{ padding: '10px', border: '1px solid #dcc58a', color: '#a3262a', fontFamily: 'Cinzel' }}>DEFECT (Total War)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #dcc58a', color: '#2f6b3b', fontFamily: 'Cinzel', fontWeight: '700' }}>
                    CONCEDE (Accept 5 Villages)
                  </td>
                  <td style={{ padding: '12px', border: '2px solid #a8802f', backgroundColor: '#f6e3b0' }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#9a6f1f' }}>(62, 92)</div>
                    <div style={{ fontSize: '10px', color: '#2f6b3b', textTransform: 'uppercase' }}>★ PARETO EFFICIENT COMPROMISE</div>
                    <div style={{ fontSize: '10px', color: '#4a2a22' }}>Pandavas: Survival; Kauravas: 95% Empire</div>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #dcc58a', backgroundColor: '#fdf7e6' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#4a2a22' }}>(10, 95)</div>
                    <div style={{ fontSize: '10px', color: '#8a6a4a' }}>Unilateral Pandava Surrender</div>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #dcc58a', color: '#a3262a', fontFamily: 'Cinzel', fontWeight: '700' }}>
                    DEFECT (Demand Entire Empire)
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #dcc58a', backgroundColor: '#fdf7e6' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#4a2a22' }}>(90, 15)</div>
                    <div style={{ fontSize: '10px', color: '#8a6a4a' }}>Unilateral Kaurava Capitulation</div>
                  </td>
                  <td style={{ padding: '12px', border: '2px solid #8b1d1d', backgroundColor: '#f6dcd3' }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#a3262a' }}>(25, 0)</div>
                    <div style={{ fontSize: '10px', color: '#a3262a', textTransform: 'uppercase' }}>☠ WAR NASH EQUILIBRIUM</div>
                    <div style={{ fontSize: '10px', color: '#4a2a22' }}>Fratricidal Annihilation (Kurukshetra)</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: '12px', color: '#4a2a22', lineHeight: '1.5' }}>
            <strong style={{ color: '#a8802f' }}>The Tragedy of Dominant Strategies:</strong> Duryodhana mistakenly calculated that defecting yielded higher status than conceding, failing to discount the terminal destruction of his dynasty (utility 0).
          </div>
        </div>

        {/* The Four Upayas Doctrine Matrix */}
        <div className="vintage-card">
          <div className="vintage-card-header">
            <div className="vintage-card-title">
              <Award size={16} color="#a8802f" />
              <span>The Four Upayas (Arthashastra Strategic Levers)</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Sāma */}
            <div style={{ borderLeft: '3px solid #a8802f', paddingLeft: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
                <span style={{ fontFamily: 'Cinzel', color: '#9a6f1f', fontWeight: '700' }}>1. SĀMA (CONCILIATION & ALIGNMENT)</span>
                <span style={{ color: '#a8802f', fontWeight: '600' }}>85% Deployment</span>
              </div>
              <p style={{ fontSize: '12px', color: '#4a2a22' }}>
                Appeals to shared lineage, common ancestors (Bharata, Shantanu), and mutual honor. Seeks common identity framing.
              </p>
            </div>

            {/* Dāna */}
            <div style={{ borderLeft: '3px solid #4f7a4a', paddingLeft: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
                <span style={{ fontFamily: 'Cinzel', color: '#2f6b3b', fontWeight: '700' }}>2. DĀNA (CONCESSION & VALUE CREATION)</span>
                <span style={{ color: '#2f6b3b', fontWeight: '600' }}>95% Deployment</span>
              </div>
              <p style={{ fontSize: '12px', color: '#4a2a22' }}>
                Offering asymmetric material compromise: reducing demands from 50% of the imperial realm down to merely 5 villages.
              </p>
            </div>

            {/* Bheda */}
            <div style={{ borderLeft: '3px solid #a8602a', paddingLeft: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
                <span style={{ fontFamily: 'Cinzel', color: '#a8602a', fontWeight: '700' }}>3. BHEDA (COALITION DIVISION & AUDIT)</span>
                <span style={{ color: '#a8602a', fontWeight: '600' }}>70% Deployment</span>
              </div>
              <p style={{ fontSize: '12px', color: '#4a2a22' }}>
                Highlighting internal fissures: counseling Karna about his Kaunteya heritage; warning Bhishma and Drona of their moral entrapment.
              </p>
            </div>

            {/* Daṇḍa */}
            <div style={{ borderLeft: '3px solid #8b1d1d', paddingLeft: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
                <span style={{ fontFamily: 'Cinzel', color: '#a3262a', fontWeight: '700' }}>4. DAṆḌA (DETERRENCE & SANCTIONS)</span>
                <span style={{ color: '#a3262a', fontWeight: '600' }}>100% Finality</span>
              </div>
              <p style={{ fontSize: '12px', color: '#4a2a22' }}>
                Demonstration of overwhelming martial certainty and the cosmic Viswaroopa revelation when diplomatic bounds are breached.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Negotiation Parameter Sandbox */}
      <div className="vintage-card">
        <div className="vintage-card-header">
          <div className="vintage-card-title">
            <Sliders size={16} color="#a8802f" />
            <span>Strategic Sensitivity Sandbox: Adjust Psychological Levers</span>
          </div>
          <span className="vintage-badge">
            Dynamic Simulation
          </span>
        </div>

        <div className="grid-3" style={{ marginBottom: '20px' }}>
          {/* Slider 1: Duryodhana Ego */}
          <div style={{ backgroundColor: '#fdf7e6', border: '1px solid #dcc58a', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
              <span style={{ color: '#4a2a22' }}>Duryodhana Status/Ego Factor</span>
              <span style={{ color: '#a3262a', fontWeight: '700' }}>{egoFactor}%</span>
            </div>
            <input 
              type="range" min="10" max="100" 
              value={egoFactor} 
              onChange={(e) => {
                setEgoFactor(parseInt(e.target.value));
                audioEngine.playParchmentSound();
              }}
              style={{ width: '100%', accentColor: '#8b1d1d' }}
            />
            <div style={{ fontSize: '10px', color: '#8a6a4a', marginTop: '6px' }}>
              Higher values increase zero-sum resistance and needle-point stonewalling.
            </div>
          </div>

          {/* Slider 2: Pandava Desperation / Concession Flexibility */}
          <div style={{ backgroundColor: '#fdf7e6', border: '1px solid #dcc58a', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
              <span style={{ color: '#4a2a22' }}>Pandava Concession Flexibility</span>
              <span style={{ color: '#2f6b3b', fontWeight: '700' }}>{desperationFactor}%</span>
            </div>
            <input 
              type="range" min="10" max="100" 
              value={desperationFactor} 
              onChange={(e) => {
                setDesperationFactor(parseInt(e.target.value));
                audioEngine.playParchmentSound();
              }}
              style={{ width: '100%', accentColor: '#3d6b3a' }}
            />
            <div style={{ fontSize: '10px', color: '#8a6a4a', marginTop: '6px' }}>
              Willingness of Yudhisthira to reduce territorial claims for peace.
            </div>
          </div>

          {/* Slider 3: Mediator Prestige / Upaya Skill */}
          <div style={{ backgroundColor: '#fdf7e6', border: '1px solid #dcc58a', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
              <span style={{ color: '#4a2a22' }}>Krishna Mediator Authority</span>
              <span style={{ color: '#9a6f1f', fontWeight: '700' }}>{mediatorPrestige}%</span>
            </div>
            <input 
              type="range" min="10" max="100" 
              value={mediatorPrestige} 
              onChange={(e) => {
                setMediatorPrestige(parseInt(e.target.value));
                audioEngine.playParchmentSound();
              }}
              style={{ width: '100%', accentColor: '#a8802f' }}
            />
            <div style={{ fontSize: '10px', color: '#8a6a4a', marginTop: '6px' }}>
              Moral suasion and credibility of third-party guarantor.
            </div>
          </div>
        </div>

        {/* Dynamic Sandbox Output */}
        <div style={{ 
          backgroundColor: '#fdf7e6', border: '1px solid #a8802f', padding: '16px',
          display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#8a6a4a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Forecasted Escalation Index
            </div>
            <div style={{ fontSize: '22px', fontFamily: 'Cinzel', color: computedEscalation > 65 ? '#a3262a' : '#2f6b3b', fontWeight: '700' }}>
              {computedEscalation}%
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#8a6a4a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Forecasted Agreement Probability
            </div>
            <div style={{ fontSize: '22px', fontFamily: 'Cinzel', color: computedAgreementRate > 40 ? '#2f6b3b' : '#a3262a', fontWeight: '700' }}>
              {computedAgreementRate}%
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: '#8a6a4a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Pareto Zone Feasibility
            </div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: isParetoPossible ? '#2f6b3b' : '#a3262a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isParetoPossible ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <span>{isParetoPossible ? 'Diplomatic Accord Accessible' : 'Catastrophic War Inevitable'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
