import React from 'react';
import { Award, Printer, Download, BookOpen, CheckCircle, FileText } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine.js';

export default function ReportView() {
  const handlePrint = () => {
    audioEngine.playParchmentSound();
    window.print();
  };

  const handleDownloadJson = () => {
    audioEngine.playParchmentSound();
    const reportData = {
      projectTitle: "Krishna’s Diplomacy: A Multi-Agent Negotiation Simulator for Conflict Resolution",
      institution: "Amrita Vishwa Vidyapeetham, Chennai Campus",
      course: "Strategic Lessons from Mahabharata",
      contemporaryProblem: "Multi-party negotiations with asymmetric information, status-driven defection, and suboptimal Nash equilibria",
      mahabharataConnection: "Sri Krishna's peace embassy to Hastinapura (Udyoga Parva)",
      metrics: {
        agreementRateForecast: "35% (Initial) down to 0% (Post-needlepoint ultimatum)",
        negotiationRounds: 5,
        concessionsMade: {
          pandavas: "Surrendered 95% of territorial claim (demanded only 5 villages)",
          kauravas: "Zero concessions (refused even a needle point of soil)"
        },
        conflictEscalationProgression: [22, 44, 68, 88, 100],
        utilities: {
          krishnaMediator: 78,
          kauravaSovereign: 82,
          pandavaConcessionist: 75,
          warBatnaKaurava: 0,
          warBatnaPandava: 25
        },
        paretoImprovementAchieved: true,
        paretoImprovementAccepted: false,
        reasonForRejection: "Hubris, status-loss aversion, and failure to discount existential war catastrophe"
      },
      keyUpayas: ["Sāma (Conciliation)", "Dāna (5 Villages Compromise)", "Bheda (Alliance Audit)", "Daṇḍa (Viswaroopa & Deterrence)"],
      pedagogicalTakeaways: [
        "A minimal viable offer exposes moral unreasonableness of the defecting party.",
        "Zero-sum framing causes catastrophic value destruction.",
        "Sacred identity anchors (Karna) resist transactional incentives.",
        "BATNA credibility is required for mediator legitimacy."
      ]
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'krishna_diplomacy_amrita_project_report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="report-view">
      {/* Action Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '18px' }}>
        <button className="vintage-btn" onClick={handleDownloadJson}>
          <Download size={13} />
          <span>Export Research JSON</span>
        </button>
        <button className="vintage-btn primary" onClick={handlePrint}>
          <Printer size={13} />
          <span>Print / Save Project Dossier</span>
        </button>
      </div>

      {/* Formal Research Project Report Scroll */}
      <div className="parchment-scroll" style={{ padding: '40px' }}>
        {/* Institutional Header */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #8f6a24', paddingBottom: '24px', marginBottom: '28px' }}>
          <div style={{ fontFamily: 'Cinzel', fontSize: '14px', letterSpacing: '0.22em', color: '#7a3b2e', marginBottom: '6px' }}>
            AMRITA VISHWA VIDYAPEETHAM • CHENNAI CAMPUS
          </div>
          <div style={{ fontSize: '11px', letterSpacing: '0.18em', color: '#8f6a24', textTransform: 'uppercase', marginBottom: '12px' }}>
            DEPARTMENT OF HUMANITIES & MANAGEMENT STUDIES
          </div>
          <h1 style={{ fontFamily: 'Cinzel', fontSize: '26px', color: '#3a1014', letterSpacing: '0.1em', marginBottom: '10px' }}>
            KRISHNA’S DIPLOMACY: A MULTI-AGENT NEGOTIATION SIMULATOR FOR CONFLICT RESOLUTION
          </h1>
          <div style={{ fontStyle: 'italic', fontFamily: 'Cormorant Garamond', fontSize: '18px', color: '#7a3b2e' }}>
            Academic Course Project for: <strong>Strategic Lessons from Mahabharata</strong>
          </div>
        </div>

        {/* Section 1: Contemporary Problem Statement */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontFamily: 'Cinzel', fontSize: '15px', color: '#3a1014', borderBottom: '1px solid #d9c28a', paddingBottom: '6px', marginBottom: '12px' }}>
            1. Contemporary Problem & Context
          </h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', marginBottom: '12px' }}>
            Modern negotiations in international geopolitics, corporate governance, and community disputes rarely occur in simple two-player, complete-information settings. 
            Instead, they involve multiple stakeholders with conflicting interests, asymmetric information, competing priorities, and vastly disparate power dynamics. 
            Conventional decision-making models assume hyper-rationality and fixed payoffs, ignoring the cognitive biases, status anxiety, and strategic adaptability of opposing actors.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7' }}>
            This simulator models how iterative diplomatic strategies, concessions, alliance fractures, and communicative postures influence conflict-resolution trajectories, 
            empirically demonstrating the conditions under which parties either converge on Pareto-efficient frontiers or defect into mutual destruction.
          </p>
        </div>

        {/* Section 2: Intended Beneficiaries */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontFamily: 'Cinzel', fontSize: '15px', color: '#3a1014', borderBottom: '1px solid #d9c28a', paddingBottom: '6px', marginBottom: '12px' }}>
            2. Intended Users & Beneficiaries
          </h3>
          <div className="grid-3" style={{ marginTop: '12px' }}>
            <div style={{ border: '1px solid #d9c28a', padding: '14px', backgroundColor: '#f3e6c4' }}>
              <strong style={{ display: 'block', fontSize: '13px', color: '#3a1014', marginBottom: '4px' }}>Management Students</strong>
              <p style={{ fontSize: '14px' }}>Analyze game-theoretic bargaining, BATNA valuation, and value creation in multi-party mergers.</p>
            </div>
            <div style={{ border: '1px solid #d9c28a', padding: '14px', backgroundColor: '#f3e6c4' }}>
              <strong style={{ display: 'block', fontSize: '13px', color: '#3a1014', marginBottom: '4px' }}>Diplomatic Trainers</strong>
              <p style={{ fontSize: '14px' }}>Explore the Four Upayas (Sāma, Dāna, Bheda, Daṇḍa) as an operational framework for bilateral peace accords.</p>
            </div>
            <div style={{ border: '1px solid #d9c28a', padding: '14px', backgroundColor: '#f3e6c4' }}>
              <strong style={{ display: 'block', fontSize: '13px', color: '#3a1014', marginBottom: '4px' }}>Ethics & Leadership Researchers</strong>
              <p style={{ fontSize: '14px' }}>Study moral legitimacy and the psychological costs of zero-sum anchoring and pride.</p>
            </div>
          </div>
        </div>

        {/* Section 3: Empirical Simulation Metrics */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontFamily: 'Cinzel', fontSize: '15px', color: '#3a1014', borderBottom: '1px solid #d9c28a', paddingBottom: '6px', marginBottom: '12px' }}>
            3. Quantitative Simulation Metrics & Evaluated Findings
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#4a2a22', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px', border: '1px solid #d9c28a' }}>Evaluation Metric</th>
                <th style={{ padding: '8px 12px', border: '1px solid #d9c28a' }}>Measured Value</th>
                <th style={{ padding: '8px 12px', border: '1px solid #d9c28a' }}>Strategic Significance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px 12px', border: '1px solid #d9c28a', fontWeight: '600' }}>Agreement Probability</td>
                <td style={{ padding: '8px 12px', border: '1px solid #d9c28a' }}>Peaked at 58% (Round 2) → Fell to 0%</td>
                <td style={{ padding: '8px 12px', border: '1px solid #d9c28a' }}>Maximum agreement window occurred precisely during the Five Villages Dāna offer.</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 12px', border: '1px solid #d9c28a', fontWeight: '600' }}>Negotiation Rounds to Impasse</td>
                <td style={{ padding: '8px 12px', border: '1px solid #d9c28a' }}>5 Formal Rounds</td>
                <td style={{ padding: '8px 12px', border: '1px solid #d9c28a' }}>Structured sequentially according to classical Arthashastra Upayas.</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 12px', border: '1px solid #d9c28a', fontWeight: '600' }}>Concessions Made</td>
                <td style={{ padding: '8px 12px', border: '1px solid #d9c28a' }}>Pandavas: 95% / Kauravas: 0%</td>
                <td style={{ padding: '8px 12px', border: '1px solid #d9c28a' }}>Asymmetric concession proved Pandava moral intent, stripping Kauravas of alliance legitimacy.</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 12px', border: '1px solid #d9c28a', fontWeight: '600' }}>Conflict Escalation Index</td>
                <td style={{ padding: '8px 12px', border: '1px solid #d9c28a' }}>22% (Round 1) → 100% (Round 5)</td>
                <td style={{ padding: '8px 12px', border: '1px solid #d9c28a' }}>Escalation surged post-Duryodhana’s attempt to bind Krishna (ambassadorial violation).</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 12px', border: '1px solid #d9c28a', fontWeight: '600' }}>Pareto-Improving Agreement Achieved?</td>
                <td style={{ padding: '8px 12px', border: '1px solid #d9c28a', color: '#3d6b3a', fontWeight: '700' }}>Mathematically YES (+130 Net Utility)</td>
                <td style={{ padding: '8px 12px', border: '1px solid #d9c28a' }}>Both parties were strictly better off under the 5 Villages treaty than in total war.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4: Key Strategic Lessons from Mahabharata */}
        <div>
          <h3 style={{ fontFamily: 'Cinzel', fontSize: '15px', color: '#3a1014', borderBottom: '1px solid #d9c28a', paddingBottom: '6px', marginBottom: '12px' }}>
            4. Core Strategic Lessons for Leadership & Conflict Resolution
          </h3>
          <ol style={{ paddingLeft: '24px', fontFamily: 'Cormorant Garamond', fontSize: '17px', lineHeight: '1.7' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>The Power of the Minimal Viable Demand:</strong> By asking for only five villages, Krishna stripped Duryodhana of all defensive justifications. In modern negotiation, when an opponent claims you want to destroy them, offering an undisputedly modest settlement tests whether their refusal is based on fear or insatiable greed.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>The Illusion of the Dominant Strategy:</strong> Duryodhana believed his 11 Akshauhinis gave him a dominant strategy to fight. He failed to incorporate the catastrophic downside of existential defeat, mistaking military numbers for guaranteed payoff.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Identity vs Transactional Bargaining (The Karna Dialogue):</strong> Material incentives cannot dislodge sacred identity commitments. Krishna’s failure to persuade Karna reveals that negotiators bound by honor or past debt cannot be bought with external surplus.
            </li>
            <li>
              <strong>Mediation Requires Moral Deterrence:</strong> True diplomacy is not passive appeasement. Krishna transitioned to Daṇḍa and the Viswaroopa because diplomacy without the credible capacity for deterrence is merely hollow supplication.
            </li>
          </ol>
        </div>

        {/* Signoff Footer */}
        <div style={{ marginTop: '36px', paddingTop: '18px', borderTop: '1px solid #d9c28a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', color: '#8a6a4a' }}>
            SUBMITTED BY: STUDENTS OF AMRITA VISHWA VIDYAPEETHAM, CHENNAI CAMPUS<br />
            COURSE: STRATEGIC LESSONS FROM MAHABHARATA
          </div>
          <div style={{ fontFamily: 'Cinzel', fontSize: '12px', color: '#7a3b2e', letterSpacing: '0.12em' }}>
            DHARMO RAKSHATI RAKSHITAH
          </div>
        </div>
      </div>
    </div>
  );
}
