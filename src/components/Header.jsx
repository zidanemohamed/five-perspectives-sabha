import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Shield, BookOpen, Compass, Award } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine.js';
import { Lotus, CrownEmblem } from './Ornaments.jsx';

export default function Header({ activeTab, setActiveTab, escalationLevel }) {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [moodLabel, setMoodLabel] = useState(audioEngine.getMoodLabel());

  useEffect(() => {
    const unsub = audioEngine.subscribe((state) => {
      setAudioPlaying(state.isPlaying);
      setVolume(state.volume);
      setMoodLabel(state.moodLabel);
    });
    return unsub;
  }, []);

  const handleAudioToggle = async () => {
    const playing = await audioEngine.toggle();
    setAudioPlaying(playing);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioEngine.setVolume(val);
  };

  const tabs = [
    { id: 'simulator', label: 'Council Simulator', Icon: Shield },
    { id: 'persona', label: '1-on-1 with Krishna', Icon: Compass },
    { id: 'analytics', label: 'Game Theory & Pareto Matrix', Icon: Music },
    { id: 'scenarios', label: 'Scenarios & Upayas', Icon: BookOpen },
    { id: 'report', label: 'Academic Project Report', Icon: Award },
  ];
  const numerals = ['I', 'II', 'III', 'IV', 'V'];

  return (
    <header className="site-header">
      {/* Devi eyes, bell & bindi — crown of the poster arch */}
      <div className="crown" title="Dharma • Artha • Shānti">
        <CrownEmblem />
      </div>

      {/* Brand block (the "SHAKTI MAHOTSAV" lockup) */}
      <h1 className="brand-title">Krishna’s Diplomacy</h1>
      <div className="brand-subtitle">Multi-Agent Negotiation Simulator</div>
      <div className="brand-year">AMRITA VISHWA VIDYAPEETHAM • CHENNAI CAMPUS</div>

      {/* "TODAY" style invitation rule + big crimson motto (the poster's date line) */}
      <div className="invite-rule">
        <Lotus />
        <span>Course Research Project</span>
        <Lotus />
      </div>
      <div className="motto-caps">Dharma • Artha • Shānti</div>
      <p className="invite-copy">
        You are warmly invited to a council of diplomacy, where devotion to dharma
        meets strategy, negotiation and the pursuit of peace.
      </p>

      {/* Institution + soundscape toolbar */}
      <div className="institution-bar">
        <div className="institution-left">
          <div className="amrita-seal-crest" title="Amrita Vishwa Vidyapeetham">
            <span>AVV</span>
          </div>
          <div className="institution-meta">
            <span className="institution-brand">AMRITA VISHWA VIDYAPEETHAM</span>
            <span className="institution-sub">Strategic Lessons from Mahabharata</span>
            <span className="institution-course">Course Research Project: Multi-Agent Negotiation Simulator</span>
          </div>
        </div>

        <div className="institution-right">
          {/* Procedural Audio Soundscape Widget */}
          <div className="audio-widget" title="Ambient Classical Soundscape (Veena & Tabla/Dundubhi)">
            <button
              className={`audio-btn ${audioPlaying ? 'active' : ''}`}
              onClick={handleAudioToggle}
              aria-label="Toggle ambient soundscape"
            >
              {audioPlaying ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>{audioPlaying ? 'Soundscape On' : 'Play Soundscape'}</span>
            </button>

            <span className="audio-mood-text">
              {audioPlaying ? `♪ ${moodLabel}` : 'Veena → Tabla Mood Engine'}
            </span>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="audio-volume-slider"
              title="Volume Control"
            />
          </div>
        </div>
      </div>

      {/* Navigation — schedule-style timeline */}
      <nav className="nav-tab-bar" aria-label="Main Navigation">
        {tabs.map(({ id, label, Icon }, i) => (
          <button
            key={id}
            className={`nav-tab-item ${activeTab === id ? 'active' : ''}`}
            onClick={() => { audioEngine.playParchmentSound(); setActiveTab(id); }}
          >
            <span className="nav-index">{numerals[i]}</span>
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}
