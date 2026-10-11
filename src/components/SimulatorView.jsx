import React, { useState, useEffect } from 'react';
import { 
  Shield, Play, FastForward, RotateCcw, AlertTriangle, 
  CheckCircle, Flame, ArrowRight, Zap, Award
} from 'lucide-react';
import { 
  SCENARIO_PRESETS, AGENT_PROFILES, CANONICAL_ROUNDS, runAIAgentTurn 
} from '../utils/simulationEngine.js';
import { audioEngine } from '../utils/audioEngine.js';
import ParetoChart from './ParetoChart.jsx';
import confetti from 'canvas-confetti';

export default function SimulatorView({ onEscalationChange }) {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIO_PRESETS[0]);
  const [currentRound, setCurrentRound] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [escalationIndex, setEscalationIndex] = useState(22);
  const [agreementRate, setAgreementRate] = useState(35);
  const [kauravaUtility, setKauravaUtility] = useState(82);
  const [pandavaUtility, setPandavaUtility] = useState(75);
  const [krishnaUtility, setKrishnaUtility] = useState(78);
  const [currentUpaya, setCurrentUpaya] = useState('Sāma (Conciliation)');
  const [isParetoImproving, setIsParetoImproving] = useState(true);
  const [negotiationLog, setNegotiationLog] = useState(CANONICAL_ROUNDS[0].speeches);
  const [allRoundsHistory, setAllRoundsHistory] = useState([CANONICAL_ROUNDS[0]]);
  const [aiLoading, setAiLoading] = useState(false);

  // Sync escalation with audio engine
  useEffect(() => {
    const normLevel = escalationIndex / 100;
    audioEngine.setEscalation(normLevel);
    if (onEscalationChange) onEscalationChange(escalationIndex);

    if (escalationIndex >= 85) {
      audioEngine.playWarDundubhi();
    }
  }, [escalationIndex]);

  const loadRoundState = (roundIdx) => {
    const data = CANONICAL_ROUNDS[roundIdx];
    setCurrentRound(data.roundNumber);
    setEscalationIndex(data.escalationIndex);
    setAgreementRate(data.agreementRate);
    setKauravaUtility(data.kauravaUtility);
    setPandavaUtility(data.pandavaUtility);
    setKrishnaUtility(data.krishnaUtility);
    setCurrentUpaya(data.upaya);
    setIsParetoImproving(data.isParetoImproving);
    setNegotiationLog(data.speeches);
  };

  const handleNextRound = async () => {
    if (currentRound >= 5) return;
    setAiLoading(true);
    audioEngine.playParchmentSound();

    const nextRoundIndex = currentRound; // 0-based for next
    const targetRoundData = CANONICAL_ROUNDS[nextRoundIndex];

    try {
      // Attempt live Groq call for Krishna and Duryodhana
      const krishnaTurn = await runAIAgentTurn({
        scenarioId: selectedScenario.id,
        currentRound: targetRoundData.roundNumber,
        history: negotiationLog,
        agentId: 'krishna',
        upayaStage: targetRoundData.upaya,
        negotiationTerms: {
          territoryIssue: selectedScenario.territoryIssue,
          escalationIndex: targetRoundData.escalationIndex
        }
      });

      const duryodhanaTurn = await runAIAgentTurn({
        scenarioId: selectedScenario.id,
        currentRound: targetRoundData.roundNumber,
        history: [...negotiationLog, krishnaTurn],
        agentId: 'duryodhana',
        upayaStage: targetRoundData.upaya,
        negotiationTerms: {
          territoryIssue: selectedScenario.territoryIssue,
          escalationIndex: targetRoundData.escalationIndex + 10
        }
      });

      // Update round state
      loadRoundState(nextRoundIndex);
      setNegotiationLog([
        krishnaTurn,
        duryodhanaTurn,
        ...(targetRoundData.speeches.filter(s => s.speakerId !== 'krishna' && s.speakerId !== 'duryodhana'))
      ]);

      if (targetRoundData.escalationIndex >= 85) {
        audioEngine.playConchShell();
      }
    } catch (err) {
      console.warn('Using deterministic round fallback:', err);
      loadRoundState(nextRoundIndex);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAutoRun = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    for (let i = currentRound; i <= 5; i++) {
      loadRoundState(i - 1);
      audioEngine.playParchmentSound();
      if (i === 4) audioEngine.playConchShell();
      await new Promise(r => setTimeout(r, 2200));
    }
    setIsSimulating(false);
  };

  const handleReset = () => {
    audioEngine.playParchmentSound();
    loadRoundState(0);
  };

  const handleInjectUpaya = (upayaName, deltaEsc, pandavaU, kauravaU) => {
    audioEngine.playVeenaPluck(330);
    setCurrentUpaya(upayaName);
    setEscalationIndex(prev => Math.max(0, Math.min(100, prev + deltaEsc)));
    setPandavaUtility(pandavaU);
    setKauravaUtility(kauravaU);
  };

  return (
    <div className="simulator-view">
      {/* Top Scenario Title & Banner */}
      <div className="vintage-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', backgroundColor: '#fdf7e6' }}>
          <div style={{ flex: '1 1 360px', padding: '28px', borderRight: '1px solid #dcc58a' }}>
            <div className="vintage-badge" style={{ marginBottom: '12px' }}>
              <Shield size={10} />
              <span>{selectedScenario.contextTag}</span>
            </div>
            <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#5c0f14' }}>
              {selectedScenario.name}
            </h1>
            <p style={{ fontStyle: 'italic', fontFamily: 'Cormorant Garamond', fontSize: '18px', color: '#a8802f', marginBottom: '14px' }}>
              "{selectedScenario.subtitle}"
            </p>
            <p style={{ fontSize: '14px', color: '#4a2a22', marginBottom: '18px', lineHeight: '1.6' }}>
              {selectedScenario.description}
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div className="vintage-badge">
                <span>Core Issue: {selectedScenario.territoryIssue}</span>
              </div>
              <div className="vintage-badge red">
                <span>Stakes: {selectedScenario.stakes}</span>
              </div>
            </div>
          </div>

          {/* Hero Painting Vignette */}
          <div style={{ flex: '1 1 300px', minHeight: '220px', position: 'relative', overflow: 'hidden' }}>
            <img 
              src="/hero.jpg" 
              alt="Surrealist Oil Painting of Krishna's Peace Table"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'contrast(1.05)' }} 
            />
            <div style={{ 
              position: 'absolute', bottom: 0, left: 0, right: 0, 
              backgroundColor: 'rgba(52, 8, 12, 0.92)', padding: '8px 14px',
              borderTop: '1px solid #e3c27a', fontSize: '11px', color: '#e3c27a',
              fontFamily: 'Cinzel', letterSpacing: '0.12em'
            }}>
              FIGURE 1: THE DIPLOMATIC EMBASSY AT HASTINAPURA (SURREALIST OIL)
            </div>
          </div>
        </div>
      </div>

      {/* Primary Telemetry & Quantitative Dashboard */}
      <div className="vintage-card">
        <div className="vintage-card-header">
          <div className="vintage-card-title">
            <Award size={16} color="#a8802f" />
            <span>Quantitative Negotiation Telemetry (Round {currentRound} of 5)</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              className="vintage-btn primary" 
              onClick={handleNextRound} 
              disabled={currentRound >= 5 || aiLoading || isSimulating}
            >
              {aiLoading ? (
                <span>Deliberating...</span>
              ) : (
                <>
                  <Play size={12} />
                  <span>Advance Round ({currentRound}/5)</span>
                </>
              )}
            </button>

            <button 
              className="vintage-btn" 
              onClick={handleAutoRun} 
              disabled={currentRound >= 5 || isSimulating || aiLoading}
            >
              <FastForward size={12} />
              <span>Auto Simulate</span>
            </button>

            <button 
              className="vintage-btn sm" 
              onClick={handleReset}
              disabled={isSimulating || aiLoading}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 4 Quantitative Metrics Panels */}
        <div className="grid-4" style={{ marginBottom: '20px' }}>
          {/* 1. Conflict Escalation */}
          <div style={{ backgroundColor: '#fdf7e6', border: '1px solid #dcc58a', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#4a2a22', textTransform: 'uppercase' }}>
                Conflict Escalation
              </span>
              <span style={{ 
                fontSize: '12px', fontWeight: '700', 
                color: escalationIndex > 70 ? '#a3262a' : escalationIndex > 40 ? '#a8802f' : '#2f6b3b' 
              }}>
                {escalationIndex}%
              </span>
            </div>
            <div className="escalation-gauge">
              <div 
                className="escalation-fill" 
                style={{ 
                  width: `${escalationIndex}%`,
                  backgroundColor: escalationIndex > 70 ? '#8b1d1d' : escalationIndex > 40 ? '#a8802f' : '#3d6b3a'
                }} 
              />
            </div>
            <div style={{ fontSize: '10px', marginTop: '6px', color: '#8a6a4a' }}>
              {escalationIndex < 30 ? 'Shānti (Diplomatic Dialogue)' : escalationIndex < 70 ? 'Sankat (Rising Tensions)' : 'Ranabheri (War Imminent)'}
            </div>
          </div>

          {/* 2. Agreement Rate */}
          <div style={{ backgroundColor: '#fdf7e6', border: '1px solid #dcc58a', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#4a2a22', textTransform: 'uppercase' }}>
                Agreement Probability
              </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: agreementRate > 40 ? '#2f6b3b' : '#a3262a' }}>
                {agreementRate}%
              </span>
            </div>
            <div className="escalation-gauge">
              <div 
                className="escalation-fill" 
                style={{ 
                  width: `${agreementRate}%`, 
                  backgroundColor: agreementRate > 40 ? '#3d6b3a' : '#8b1d1d' 
                }} 
              />
            </div>
            <div style={{ fontSize: '10px', marginTop: '6px', color: '#8a6a4a' }}>
              {agreementRate > 50 ? 'ZOPA Feasible' : 'ZOPA Collapsing'}
            </div>
          </div>

          {/* 3. Active Upaya Lever */}
          <div style={{ backgroundColor: '#fdf7e6', border: '1px solid #dcc58a', padding: '16px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#4a2a22', textTransform: 'uppercase', marginBottom: '6px' }}>
              Active Diplomatic Upaya
            </div>
            <div style={{ fontSize: '13px', fontFamily: 'Cinzel', color: '#a8802f', fontWeight: '600' }}>
              {currentUpaya}
            </div>
            <div style={{ fontSize: '10px', marginTop: '6px', color: '#8a6a4a' }}>
              Chanakya / Arthashastra Doctrine
            </div>
          </div>

          {/* 4. Pareto Status */}
          <div style={{ backgroundColor: '#fdf7e6', border: '1px solid #dcc58a', padding: '16px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#4a2a22', textTransform: 'uppercase', marginBottom: '6px' }}>
              Pareto Improvement
            </div>
            <div style={{ 
              fontSize: '13px', fontWeight: '700', 
              color: isParetoImproving ? '#2f6b3b' : '#a3262a',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}>
              {isParetoImproving ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
              <span>{isParetoImproving ? 'Achieved (+130 Net)' : 'Violated (Zero-Sum)'}</span>
            </div>
            <div style={{ fontSize: '10px', marginTop: '6px', color: '#8a6a4a' }}>
              Superior to War BATNA (0, 25)
            </div>
          </div>
        </div>

        {/* Upaya Tactical Injectors */}
        <div style={{ 
          borderTop: '1px solid #dcc58a', paddingTop: '14px', 
          display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' 
        }}>
          <span style={{ fontSize: '11px', color: '#a8802f', fontFamily: 'Cinzel', letterSpacing: '0.12em' }}>
            INJECT UPAYA LEVER:
          </span>
          <button 
            className="vintage-btn sm" 
            onClick={() => handleInjectUpaya('Sāma (Conciliation)', -10, 75, 80)}
            title="Sāma: Appeal to lineage, brotherhood, and moral persuasion"
          >
            Sāma (Conciliation)
          </button>
          <button 
            className="vintage-btn sm" 
            onClick={() => handleInjectUpaya('Dāna (Concession: 5 Villages)', -5, 60, 92)}
            title="Dāna: Radical compromise offering asymmetric surplus"
          >
            Dāna (5 Villages)
          </button>
          <button 
            className="vintage-btn sm" 
            onClick={() => handleInjectUpaya('Bheda (Coalition Audit)', 12, 50, 65)}
            title="Bheda: Expose internal fault-lines and false security"
          >
            Bheda (Divide/Audit)
          </button>
          <button 
            className="vintage-btn sm danger" 
            onClick={() => handleInjectUpaya('Daṇḍa (Viswaroopa / Deterrence)', 25, 30, 20)}
            title="Daṇḍa: Unwavering moral and existential deterrence"
          >
            Daṇḍa (Deterrence)
          </button>
        </div>
      </div>

      {/* Main Grid: Live Assembly Council Speeches (Left) & Pareto Mathematical Model (Right) */}
      <div className="grid-2">
        {/* Left: Dialogue Transcript */}
        <div className="vintage-card">
          <div className="vintage-card-header">
            <div className="vintage-card-title">
              <Shield size={16} color="#a8802f" />
              <span>Hastinapura Assembly Deliberation Log</span>
            </div>
            <span className="vintage-badge">
              Active Round: {currentRound}
            </span>
          </div>

          <div className="council-dialogues" style={{ maxHeight: '580px', overflowY: 'auto', paddingRight: '8px' }}>
            {negotiationLog.map((speech, idx) => {
              const speaker = AGENT_PROFILES[speech.speakerId] || {
                name: speech.speakerName || speech.speakerId,
                title: 'Royal Counselor',
                avatar: null
              };

              return (
                <div key={idx} className={`speech-bubble ${speech.speakerId}`}>
                  <div className="speech-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="agent-vignette" style={{ width: '42px', height: '42px' }}>
                        {speaker.avatar ? (
                          <img src={speaker.avatar} alt={speaker.name} />
                        ) : (
                          <span style={{ fontSize: '18px', color: '#a8802f' }}>
                            {speaker.name[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="speaker-title">{speaker.name}</div>
                        <div style={{ fontSize: '10px', color: '#8a6a4a', textTransform: 'uppercase' }}>
                          {speaker.title}
                        </div>
                      </div>
                    </div>

                    <span className="vintage-badge">
                      {speech.speakerId === 'krishna' ? 'Envoy' : speech.speakerId === 'duryodhana' ? 'Sovereign' : 'Elder'}
                    </span>
                  </div>

                  <p className="speaker-quote">
                    "{speech.text}"
                  </p>

                  {speech.analysis && (
                    <div className="speech-analysis-box">
                      <Zap size={11} color="#a8802f" />
                      <span><strong>Strategic Maneuver:</strong> {speech.analysis}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Pareto Frontier Graph & Agent Utility Gauges */}
        <div>
          <div className="vintage-card">
            <div className="vintage-card-header">
              <div className="vintage-card-title">
                <Award size={16} color="#a8802f" />
                <span>The Pareto Frontier & BATNA War Abyss</span>
              </div>
            </div>
            <ParetoChart 
              currentKaurava={kauravaUtility} 
              currentPandava={pandavaUtility} 
              currentRound={currentRound} 
            />
          </div>

          {/* Stakeholder Utility Meters */}
          <div className="vintage-card">
            <div className="vintage-card-header">
              <div className="vintage-card-title">
                <span>Stakeholder Utility Scores</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Duryodhana Utility */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: '#4a2a22' }}>Crown Prince Duryodhana (Pride / Retained Hegemony)</span>
                  <span style={{ color: '#9a6f1f', fontWeight: '700' }}>{kauravaUtility} / 100</span>
                </div>
                <div className="escalation-gauge" style={{ height: '8px' }}>
                  <div className="escalation-fill" style={{ width: `${kauravaUtility}%`, backgroundColor: '#8b1d1d' }} />
                </div>
              </div>

              {/* Pandava Utility */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: '#4a2a22' }}>King Yudhisthira (Dharma / Preservation of Life)</span>
                  <span style={{ color: '#9a6f1f', fontWeight: '700' }}>{pandavaUtility} / 100</span>
                </div>
                <div className="escalation-gauge" style={{ height: '8px' }}>
                  <div className="escalation-fill" style={{ width: `${pandavaUtility}%`, backgroundColor: '#3d6b3a' }} />
                </div>
              </div>

              {/* Krishna Mediator Utility */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: '#4a2a22' }}>Sri Krishna (Cosmic Order / Avoidance of Fratricide)</span>
                  <span style={{ color: '#9a6f1f', fontWeight: '700' }}>{krishnaUtility} / 100</span>
                </div>
                <div className="escalation-gauge" style={{ height: '8px' }}>
                  <div className="escalation-fill" style={{ width: `${krishnaUtility}%`, backgroundColor: '#a8802f' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
