import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Compass, Sparkles, AlertCircle, Award, 
  MessageSquare, User, ArrowRight, ShieldCheck, Flame
} from 'lucide-react';
import { USER_PERSONAS, sendPersonaDialogue } from '../utils/personaEngine.js';
import { audioEngine } from '../utils/audioEngine.js';

export default function PersonaView({ onEscalationChange }) {
  const [selectedPersona, setSelectedPersona] = useState(USER_PERSONAS[0]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [escalation, setEscalation] = useState(30);
  const [dharmicScore, setDharmicScore] = useState(50);
  const chatBottomRef = useRef(null);

  // Initialize opening greeting when persona changes
  useEffect(() => {
    setEscalation(selectedPersona.initialEscalation);
    if (onEscalationChange) onEscalationChange(selectedPersona.initialEscalation);

    // Initial greeting from Krishna tailored to the chosen persona
    let greeting = '';
    if (selectedPersona.id === 'duryodhana') {
      greeting = 'I come to Hastinapura, Suyodhana, with hands outstretched in peace. The Pandavas, having endured thirteen years of wilderness, ask only for five villages. Will you choose the flourishing of your dynasty, or the funeral pyres of Kurukshetra?';
    } else if (selectedPersona.id === 'karna') {
      greeting = 'Radheya, come sit beside me upon this chariot. The time has come to cast off the veil of illusion. You are not the son of a charioteer; you are the eldest son of Kunti, born of Surya himself. The imperial crown of Aryavarta awaits your brow.';
    } else if (selectedPersona.id === 'yudhisthira') {
      greeting = 'Dharmaraja, before I mount my chariot for Hastinapura, speak to me without reservation. How far shall we lower our demands for peace before honour itself is extinguished?';
    } else if (selectedPersona.id === 'dhritarashtra') {
      greeting = 'O King Dhritarashtra, sovereign of the Kurus! You hold the scales of destiny in your blind hands. Will you guide your son Duryodhana toward the light of Dharma, or permit his wrath to burn your ancestors’ legacy to ashes?';
    } else {
      greeting = 'Welcome, seeker of statecraft. In this sacred chamber, let us examine whether modern concepts of game theory, Nash equilibrium, and BATNA can resolve what human pride once cast into the fire of Kurukshetra.';
    }

    setMessages([
      {
        sender: 'krishna',
        text: greeting,
        tactic: 'Diplomatic Opening',
        upaya: 'Sāma (Conciliation)'
      }
    ]);

    setCurrentAnalysis({
      negotiationTactic: 'Diplomatic Opening',
      upayaEmployedByKrishna: 'Sāma (Conciliation)',
      strategicCritique: 'The mediator opens by establishing moral stakes and setting an anchor for dialogue.'
    });
  }, [selectedPersona]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend = inputText) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg = textToSend.trim();
    setInputText('');
    audioEngine.playParchmentSound();

    const newHistory = [...messages, { sender: 'user', text: userMsg }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await sendPersonaDialogue({
        personaId: selectedPersona.id,
        userMessage: userMsg,
        chatHistory: newHistory,
        currentEscalation: escalation
      });

      const nextEscalation = Math.max(5, Math.min(100, escalation + response.escalationDelta));
      setEscalation(nextEscalation);
      setDharmicScore(response.dharmicScore);
      setCurrentAnalysis(response);

      if (onEscalationChange) onEscalationChange(nextEscalation);
      audioEngine.setEscalation(nextEscalation / 100);

      if (nextEscalation > 75) {
        audioEngine.playWarDundubhi();
      } else {
        audioEngine.playVeenaPluck(293.66);
      }

      setMessages([
        ...newHistory,
        {
          sender: 'krishna',
          text: response.speech,
          tactic: response.negotiationTactic,
          upaya: response.upayaEmployedByKrishna,
          critique: response.strategicCritique
        }
      ]);
    } catch (err) {
      console.error('Error during persona dialogue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="persona-view">
      {/* Top Persona Selector Bar */}
      <div className="vintage-card" style={{ marginBottom: '20px' }}>
        <div className="vintage-card-header">
          <div className="vintage-card-title">
            <Compass size={16} color="#a8802f" />
            <span>Select Your Negotiator Persona</span>
          </div>
          <span className="vintage-badge">
            Interactive Chamber
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
          {USER_PERSONAS.map((p) => {
            const isSelected = p.id === selectedPersona.id;
            return (
              <div 
                key={p.id}
                onClick={() => {
                  audioEngine.playParchmentSound();
                  setSelectedPersona(p);
                }}
                style={{
                  backgroundColor: isSelected ? '#f6e3b0' : '#fdf7e6',
                  border: isSelected ? '1px solid #a8802f' : '1px solid #dcc58a',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ 
                    fontFamily: 'Cinzel', fontSize: '12px', fontWeight: '700', 
                    color: isSelected ? '#9a6f1f' : '#5c0f14', letterSpacing: '0.08em' 
                  }}>
                    {p.name}
                  </span>
                  <span className={`vintage-badge ${isSelected ? 'green' : ''}`} style={{ fontSize: '9px' }}>
                    {p.badge}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#4a2a22', lineHeight: '1.4' }}>
                  {p.tagline}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Split Grid: Krishna's Presence & Tactical Radar (Left) + Live Council Dialogue (Right) */}
      <div className="grid-2">
        {/* Left Column: Sri Krishna's Portrait & Tactical Analytics */}
        <div>
          <div className="vintage-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '340px' }}>
              <img 
                src="/krishna_portrait.jpg" 
                alt="Sri Krishna Vintage Oil Painting"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'contrast(1.05)' }} 
              />
              <div style={{ 
                position: 'absolute', bottom: 0, left: 0, right: 0,
                backgroundColor: 'rgba(52, 8, 12, 0.92)',
                padding: '12px 16px', borderTop: '1px solid #e3c27a'
              }}>
                <div style={{ fontFamily: 'Cinzel', fontSize: '14px', color: '#efd391', fontWeight: '700', letterSpacing: '0.12em' }}>
                  SRI KRISHNA
                </div>
                <div style={{ fontSize: '11px', color: '#f5ead0', fontStyle: 'italic', fontFamily: 'Cormorant Garamond' }}>
                  Supreme Envoy of Dharma • Hastinapura Peace Embassy
                </div>
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              {/* Conflict Escalation Meter */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <span style={{ color: '#4a2a22' }}>Chamber Escalation Index</span>
                  <span style={{ color: escalation > 70 ? '#a3262a' : '#a8802f', fontWeight: '700' }}>{escalation}%</span>
                </div>
                <div className="escalation-gauge" style={{ height: '8px' }}>
                  <div 
                    className="escalation-fill" 
                    style={{ 
                      width: `${escalation}%`,
                      backgroundColor: escalation > 70 ? '#8b1d1d' : escalation > 40 ? '#a8802f' : '#3d6b3a'
                    }} 
                  />
                </div>
              </div>

              {/* Dharmic Alignment Meter */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <span style={{ color: '#4a2a22' }}>Dharmic Strategic Alignment</span>
                  <span style={{ color: '#2f6b3b', fontWeight: '700' }}>{dharmicScore}%</span>
                </div>
                <div className="escalation-gauge" style={{ height: '8px' }}>
                  <div className="escalation-fill" style={{ width: `${dharmicScore}%`, backgroundColor: '#3d6b3a' }} />
                </div>
              </div>

              {/* Krishna's Real-time Strategic Critique Box */}
              {currentAnalysis && (
                <div style={{ backgroundColor: '#fdf7e6', border: '1px solid #a8802f', padding: '14px', marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a8802f', fontFamily: 'Cinzel', fontSize: '11px', letterSpacing: '0.12em', marginBottom: '6px' }}>
                    <Award size={13} />
                    <span>DIPLOMATIC EVALUATION</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#5c0f14', marginBottom: '6px' }}>
                    <strong>Your Maneuver:</strong> <span style={{ color: '#9a6f1f' }}>{currentAnalysis.negotiationTactic}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#5c0f14', marginBottom: '6px' }}>
                    <strong>Krishna’s Counter-Upaya:</strong> <span style={{ color: '#4f7a4a' }}>{currentAnalysis.upayaEmployedByKrishna}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#4a2a22', fontStyle: 'italic', borderTop: '1px solid #dcc58a', paddingTop: '6px', marginTop: '6px', lineHeight: '1.5' }}>
                    "{currentAnalysis.strategicCritique}"
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chat Chamber */}
        <div className="vintage-card" style={{ display: 'flex', flexDirection: 'column', height: '620px' }}>
          <div className="vintage-card-header">
            <div className="vintage-card-title">
              <MessageSquare size={16} color="#a8802f" />
              <span>Direct Audience with Krishna</span>
            </div>
            <span className="vintage-badge">
              Persona: {selectedPersona.name}
            </span>
          </div>

          {/* Chat Transcript Area */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', marginBottom: '14px' }}>
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`speech-bubble ${m.sender === 'krishna' ? 'krishna' : 'duryodhana'}`}
                style={{
                  backgroundColor: m.sender === 'krishna' ? '#fdf7e6' : '#fbebe4',
                  borderLeft: m.sender === 'krishna' ? '3px solid #a8802f' : '3px solid #8b1d1d'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'Cinzel', fontSize: '11px', color: m.sender === 'krishna' ? '#9a6f1f' : '#5c0f14', letterSpacing: '0.12em' }}>
                    {m.sender === 'krishna' ? 'SRI KRISHNA' : selectedPersona.name.toUpperCase()}
                  </span>
                  {m.upaya && (
                    <span className="vintage-badge" style={{ fontSize: '9px' }}>
                      {m.upaya}
                    </span>
                  )}
                </div>

                <p style={{ 
                  fontFamily: 'Cormorant Garamond', fontSize: '17px', lineHeight: '1.6', 
                  color: '#5c0f14', fontStyle: m.sender === 'krishna' ? 'italic' : 'normal' 
                }}>
                  "{m.text}"
                </p>
              </div>
            ))}

            {isLoading && (
              <div className="speech-bubble krishna" style={{ opacity: 0.8 }}>
                <span style={{ fontSize: '12px', fontStyle: 'italic', color: '#a8802f' }}>
                  Sri Krishna weighs your words against the scales of Dharma and time...
                </span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Suggested Opening Prompts Pills */}
          <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '10px', color: '#8a6a4a', fontFamily: 'Cinzel', letterSpacing: '0.1em', alignSelf: 'center' }}>
              SUGGESTED DISPATCH:
            </span>
            <button 
              className="vintage-btn sm" 
              onClick={() => handleSendMessage(selectedPersona.suggestedFirstMessage)}
              disabled={isLoading}
              style={{ fontSize: '10px', textTransform: 'none', padding: '4px 8px' }}
            >
              "{selectedPersona.suggestedFirstMessage.slice(0, 48)}..."
            </button>
          </div>

          {/* Input Box */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ display: 'flex', gap: '10px' }}
          >
            <input 
              type="text" 
              className="vintage-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Speak as ${selectedPersona.name} to Sri Krishna...`}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="vintage-btn primary"
              disabled={isLoading || !inputText.trim()}
              style={{ flexShrink: 0 }}
            >
              <Send size={13} />
              <span>Dispatch</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
