import React, { useState } from 'react';
import Header from './components/Header.jsx';
import SimulatorView from './components/SimulatorView.jsx';
import PersonaView from './components/PersonaView.jsx';
import AnalyticsView from './components/AnalyticsView.jsx';
import ScenariosView from './components/ScenariosView.jsx';
import ReportView from './components/ReportView.jsx';
import { getActiveKeyIndex } from './utils/groqClient.js';
import { audioEngine } from './utils/audioEngine.js';
import { Lotus } from './components/Ornaments.jsx';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [escalationLevel, setEscalationLevel] = useState(22);

  const handleSelectScenarioFromDossier = (scenario) => {
    setActiveTab('simulator');
    audioEngine.playParchmentSound();
  };

  return (
    <div className="stage">
      {/* Maroon curtains + diyas framing the poster */}
      <div className="curtain curtain-left" aria-hidden="true" />
      <div className="curtain curtain-right" aria-hidden="true" />
      <div className="diya-row" aria-hidden="true">
        <span className="diya" />
        <span className="diya" />
        <span className="diya" />
      </div>

      <div className="app-container">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          escalationLevel={escalationLevel}
        />

        {/* Main Viewport (keyed so each tab fades in) */}
        <main className="main-viewport" key={activeTab}>
          {activeTab === 'simulator' && (
            <SimulatorView onEscalationChange={setEscalationLevel} />
          )}

          {activeTab === 'persona' && (
            <PersonaView onEscalationChange={setEscalationLevel} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView />
          )}

          {activeTab === 'scenarios' && (
            <ScenariosView onSelectScenario={handleSelectScenarioFromDossier} />
          )}

          {activeTab === 'report' && (
            <ReportView />
          )}
        </main>

        {/* Closing plate, like the poster footer */}
        <footer className="poster-footer">
          <div className="invite-rule">
            <Lotus />
          </div>
          <div className="footer-venue">Amrita Vishwa Vidyapeetham, Chennai Campus</div>
          <div className="footer-title">
            KRISHNA’S DIPLOMACY • MULTI-AGENT NEGOTIATION SIMULATOR • STRATEGIC LESSONS FROM MAHABHARATA
          </div>
          <div className="footer-plate">
            <span>◆</span>
            <span>SATYAM EVA JAYATE</span>
            <span>◆</span>
          </div>
          <div className="footer-meta">
            <span className="vintage-badge">
              Active Key Pool: Groq Key #{getActiveKeyIndex() + 1} (Auto-Rotating)
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
