// Multi-Agent Negotiation Simulator Engine for 'Krishna’s Diplomacy'
// Models strategic multi-party negotiations, Pareto frontiers, Upaya evolution, and conflict escalation curves.

import { callGroqChat } from './groqClient.js';

export const SCENARIO_PRESETS = [
  {
    id: 'hastinapura_embassy',
    name: 'The Embassy at Hastinapura (Canonical)',
    subtitle: 'Krishna demands 5 villages to prevent fratricide in Udyoga Parva',
    description: 'Krishna arrives as royal envoy in the Kaurava assembly. The Pandavas, having completed 13 years of exile, ask only for five villages: Panipat, Sonipat, Baghpat, Tilpat, and Kutila. Duryodhana refuses even a needle-point of soil.',
    contextTag: 'Mahābhārata Udyoga Parva',
    initialEscalation: 20,
    maxRounds: 5,
    agents: ['krishna', 'duryodhana', 'yudhisthira', 'bhishma', 'shakuni'],
    territoryIssue: 'Sovereignty of Indraprastha vs Five Villages Compromise',
    stakes: '18 Akshauhinis (4 million soldiers) and the future of Aryavarta'
  },
  {
    id: 'karna_overture',
    name: 'The Chariot Overture to Karna',
    subtitle: 'Krishna deploys Bheda and Dāna to dismantle the Kaurava spearhead',
    description: 'Before departing Hastinapura, Krishna takes Karna into his golden chariot. He reveals Karna is Kunti’s firstborn (Kaunteya), offering him the imperial coronation as Emperor of Aryavarta and Draupadi as queen if he defects from Duryodhana.',
    contextTag: 'Psychological Anchoring & Debt of Honor',
    initialEscalation: 35,
    maxRounds: 4,
    agents: ['krishna', 'karna', 'duryodhana'],
    territoryIssue: 'Imperial Succession vs Inviolable Friendship (Mitra-Dharma)',
    stakes: 'Severing Duryodhana’s primary martial deterrent'
  },
  {
    id: 'contemporary_border',
    name: 'Modern Geopolitical Riparian Accord',
    subtitle: 'Shared River Basin Dispute modeled through Mahabharata Strategic Archetypes',
    description: 'Two nuclear-armed states dispute upstream damming and water allocation. The Mediator (Krishna archetype) seeks a Pareto-improving joint stewardship treaty against a Revisionist Nationalist leader (Duryodhana archetype).',
    contextTag: 'Contemporary Conflict Resolution',
    initialEscalation: 30,
    maxRounds: 5,
    agents: ['krishna', 'duryodhana', 'yudhisthira'],
    territoryIssue: '60/40 Water Flow Split with Joint Hydropower Grid',
    stakes: 'Regional stability, food security, and risk of armed escalation'
  },
  {
    id: 'corporate_takeover',
    name: 'Corporate Hostile Takeover & Boardroom Impasse',
    subtitle: 'Founder autonomy vs Majority conglomerate buyout',
    description: 'A venture-backed founder holding visionary patents faces predatory acquisition by an entrenched conglomerate. The Lead Independent Arbitrator attempts a non-zero-sum equity carveout before destructive litigation.',
    contextTag: 'Strategic Management & Game Theory',
    initialEscalation: 25,
    maxRounds: 4,
    agents: ['krishna', 'duryodhana', 'yudhisthira'],
    territoryIssue: '35% Voting Share Carve-out with Golden Share Veto',
    stakes: 'Valuation haircut, intellectual property liquidation, enterprise survival'
  }
];

export const AGENT_PROFILES = {
  krishna: {
    id: 'krishna',
    name: 'Sri Krishna',
    title: 'The Supreme Diplomat & Peace Envoy',
    archetype: 'Dharmic Mediator / Pareto Maximizer',
    avatar: '/krishna_portrait.jpg',
    color: '#C8A96E',
    batna: 'Kurukshetra War (Destruction of the Kaurava army, moral vindication at catastrophic cost)',
    batnaUtility: 30,
    traits: ['Foresight', 'Empathy', 'Multilevel Framing', 'Strategic Resolve'],
    systemPrompt: `You are Sri Krishna, acting as peace envoy (Shanti-Doot) at the royal court of Hastinapura in the Udyoga Parva of the Mahabharata.
Your mission is to avert catastrophic war (18 Akshauhinis) while preserving Dharma. You negotiate with divine patience, supreme eloquence, and strategic clarity.
You employ the Four Upayas in succession:
- Sāma: Appealing to family honor, paternal legacy, and common blood.
- Dāna: Offering radical compromise (asking only for five villages: Panipat, Sonipat, Baghpat, Tilpat, Kutila for the five Pandava brothers, leaving the imperial throne and treasury to Duryodhana).
- Bheda: Warning of inevitable alliance fragmentation and exposing the tragic vanity of evil counselors.
- Daṇḍa: Moral deterrence, revealing the unavoidable cosmic and martial annihilation that war entails.
Keep your response dignified, philosophically incisive, and grounded in ancient diplomatic strategy. Speak in 2 to 4 powerful sentences.`
  },
  duryodhana: {
    id: 'duryodhana',
    name: 'Crown Prince Duryodhana',
    title: 'Sovereign of Hastinapura & Kuru Heir',
    archetype: 'Zero-Sum Defector / Status Maximizer',
    avatar: '/duryodhana_portrait.jpg',
    color: '#9E3C30',
    batna: 'War with 11 Akshauhinis led by Bhishma, Drona, and Karna; belief in absolute victory',
    batnaUtility: 45,
    traits: ['Ego-anchored', 'Pride', 'High Threat Sensitivity', 'Zero-Sum Mentality'],
    systemPrompt: `You are Crown Prince Duryodhana of Hastinapura.
You possess 11 Akshauhini divisions, supported by the invincible Bhishma, Drona, and Karna.
You view the Pandavas as illegitimate pretenders who lost their kingdom fairly in dice and whose subsequent claims are an insult.
To you, concession is weakness. You famously declare: "I will not yield to the Pandavas even enough land to accommodate the sharp point of a needle!"
You suspect Krishna of biased partisanship disguised as righteousness.
Respond fiercely, defending your absolute sovereign right, rejecting compromise, and questioning the mediator’s neutrality. Speak in 2 to 3 biting sentences.`
  },
  yudhisthira: {
    id: 'yudhisthira',
    name: 'Dharmaraja Yudhisthira',
    title: 'King of Indraprastha & Pandava Elder',
    archetype: 'Dutiful Concessionist / War Averse',
    avatar: null,
    color: '#5B7B58',
    batna: 'Reclamation of kingdom through total war, but haunted by the sin of destroying relatives',
    batnaUtility: 25,
    traits: ['Moral restraint', 'Self-sacrifice', 'Concession flexibility'],
    systemPrompt: `You are King Yudhisthira. You abhor war and fratricide. You are willing to surrender imperial splendor and accept mere sustenance (five villages) so your brothers may fulfill their Kshatriya rites without shedding the blood of cousins and elders. Speak with solemn dignity and peaceful resolve.`
  },
  bhishma: {
    id: 'bhishma',
    name: 'Bhishma Pitamaha',
    title: 'Grand Patriarch of the Kuru Dynasty',
    archetype: 'Institutional Elder / Moral Dissuader',
    avatar: null,
    color: '#8C7B65',
    batna: 'Compelled by oath to fight for Hastinapura throne against his beloved Pandavas',
    batnaUtility: 10,
    traits: ['Duty-bound', 'Sorrowful wisdom', 'Dynastic preservation'],
    systemPrompt: `You are Bhishma, patriarch of the Kurus. You plead with Duryodhana to heed Krishna’s counsel. You remind the assembly that where Krishna and Dharma stand, victory is certain, and that obstinacy will burn Hastinapura to ashes.`
  },
  shakuni: {
    id: 'shakuni',
    name: 'King Shakuni of Gandhara',
    title: 'Royal Counselor & Strategic Provocateur',
    archetype: 'Disruptive Manipulator / Asymmetric Agitator',
    avatar: null,
    color: '#7A6248',
    batna: 'Destruction of the Kuru lineage through engineered war',
    batnaUtility: 50,
    traits: ['Cynicism', 'Framing manipulation', 'Ego flattery'],
    systemPrompt: `You are Shakuni, uncle to Duryodhana. You subtly stoke Duryodhana’s pride, framing Krishna’s offer of five villages as an insincere Pandava ploy or sign of Pandava weakness and fear. Speak with sly, calculated rhetoric.`
  },
  karna: {
    id: 'karna',
    name: 'King Karna of Anga',
    title: 'Duryodhana’s Champion & Loyal Ally',
    archetype: 'Tragic Loyalist / Honor Anchor',
    avatar: null,
    color: '#A06D3B',
    batna: 'Fated duel with Arjuna on the battlefield of Kurukshetra',
    batnaUtility: 35,
    traits: ['Fierce gratitude', 'Unyielding loyalty', 'Martial pride'],
    systemPrompt: `You are Karna, King of Anga. Duryodhana gave you honor when the world despised you. Even when offered empires or brotherhood, your loyalty to Duryodhana cannot be bought. You speak with proud martial dignity and tragic resolve.`
  }
};

// Deterministic simulation fallback for instant preview & offline guarantees
export const CANONICAL_ROUNDS = [
  {
    roundNumber: 1,
    upaya: 'Sāma (Conciliation & Family Honor)',
    escalationIndex: 22,
    agreementRate: 35,
    paretoStatus: 'Feasible Win-Win Window Open',
    isParetoImproving: true,
    pandavaUtility: 75,
    kauravaUtility: 82,
    krishnaUtility: 78,
    territoryOffered: 'Imperial Partition: Return Indraprastha, keep Hastinapura intact',
    speeches: [
      {
        speakerId: 'krishna',
        text: 'O noble King Dhritarashtra and Prince Duryodhana! I stand in this venerable assembly not as a partisan, but as a kinsman and friend to both houses. Let not the glory of the house of Bharata be consumed in the pyre of wrath. The Pandavas, having fulfilled thirteen years of bitter exile according to your covenant, ask for their rightful portion, that both lineages may flourish like two arms of a single mighty king.',
        analysis: 'Deploying Sāma: Emphasizing common ancestral lineage, shared sovereignty, and mutual gain.'
      },
      {
        speakerId: 'bhishma',
        text: 'Listen to the son of Vasudeva, my son Duryodhana! What Krishna speaks is rooted in righteousness and dynastic preservation. To share the kingdom with your brothers is not a loss of majesty, but the double fortification of our house against all earthly foes.',
        analysis: 'Institutional elder reinforcement: Validating the mediator’s impartiality and mutual welfare.'
      },
      {
        speakerId: 'duryodhana',
        text: 'Krishna, your speech is honeyed, but your heart beats solely for the sons of Kunti! Why should I, who rules the earth from the eastern ocean to the western mountains, cede an empire won by their own folly and dice? We do not fear their arrows, nor will we share a throne that belongs to the throne of Hastinapura alone.',
        analysis: 'Zero-sum anchoring: Rejection of mutual gain framing, viewing concession as humiliation.'
      }
    ]
  },
  {
    roundNumber: 2,
    upaya: 'Dāna (Concession & Radical Sacrifice: 5 Villages)',
    escalationIndex: 44,
    agreementRate: 58,
    paretoStatus: 'Maximum Pareto Surplus Proposed',
    isParetoImproving: true,
    pandavaUtility: 60,
    kauravaUtility: 92,
    krishnaUtility: 85,
    territoryOffered: 'Five Villages only: Avisthala, Vrikasthala, Makandi, Varanavata, and Kushasthala (Panipat, Sonipat, etc.)',
    speeches: [
      {
        speakerId: 'krishna',
        text: 'Then hear the depth of Pandava concession, Prince Duryodhana! King Yudhisthira, wishing above all things to spare the lives of mothers, children, and warriors, renounces his imperial claim to Indraprastha. Give them merely five villages—one for each brother. Retain the imperial treasury, the mighty cities, the hundred vassal kingdoms, and the crown of the Kurus for yourself. Let five villages be the price of world peace!',
        analysis: 'Deploying Dāna: Extreme asymmetric concession. Pandavas surrender 95% of their legal claim to unlock a Pareto improvement.'
      },
      {
        speakerId: 'shakuni',
        text: 'Be wary, nephew! If the Pandavas are content with five villages, why did they gather seven full armies at Upaplavya? It is an ambush cloaked in modesty! Grant them five villages, and tomorrow those five gates become fortresses aimed at Hastinapura.',
        analysis: 'Paranoid disruption: Re-framing a massive concession as deceptive reconnaissance.'
      },
      {
        speakerId: 'duryodhana',
        text: 'Neither five villages, nor five towns, nor five dwellings shall they have! While I draw breath, I will not surrender to the sons of Pandu even that much soil as is pierced by the sharp point of a needle! If they desire land, let them wash their chariots in the river of blood at Kurukshetra!',
        analysis: 'Defection to BATNA: Absolute stonewall. The needle-point declaration marks the classic rejection of the Pareto frontier.'
      }
    ]
  },
  {
    roundNumber: 3,
    upaya: 'Bheda (Internal Division & Coalition Audit)',
    escalationIndex: 68,
    agreementRate: 24,
    paretoStatus: 'Pareto Window Narrowing; Asymmetric Risk',
    isParetoImproving: false,
    pandavaUtility: 45,
    kauravaUtility: 60,
    krishnaUtility: 50,
    territoryOffered: 'Mediation with Kuru Elders & Demilitarization Pledge',
    speeches: [
      {
        speakerId: 'krishna',
        text: 'Duryodhana, you boast of your eleven armies, but you mistake the presence of great men for their blessings! Bhishma loves the Pandavas as his own breath; Drona will not strike with joy against Arjuna; and your alliance is bound by fear, not righteousness. When the sky darkens with Gandiva’s arrows, the hollow counselors who flatter your vanity today will scatter like chaff before the monsoon wind.',
        analysis: 'Deploying Bheda: Psychological coalition breakdown. Revealing internal structural vulnerabilities in the Kaurava war council.'
      },
      {
        speakerId: 'duryodhana',
        text: 'Do not seek to sow discord in my court, Yadava! Karna alone stands equal to all five sons of Pandu combined. With Karna’s spear and Drona’s celestial weapons, the Pandavas will perish before midday. Guard your own words before your envoy immunity is forgotten!',
        analysis: 'Escalation to threat of diplomatic arrest: Violation of ambassadorial norms.'
      }
    ]
  },
  {
    roundNumber: 4,
    upaya: 'Daṇḍa (Deterrence, Sanctions & The Viswaroopa)',
    escalationIndex: 88,
    agreementRate: 12,
    paretoStatus: 'Severe Sub-Optimal Impasse; War Inevitable',
    isParetoImproving: false,
    pandavaUtility: 30,
    kauravaUtility: 25,
    krishnaUtility: 32,
    territoryOffered: 'Ultimatum: Unconditional Return of Legal Rights or Total War',
    speeches: [
      {
        speakerId: 'krishna',
        text: 'You dare attempt to chain me, Duryodhana? You who cannot restrain your own greed now seek to bind the ambassador of peace? Behold then that I do not stand alone!',
        analysis: 'The Viswaroopa Epiphany: Transcendental Daṇḍa. Revealing the absolute imbalance of cosmic and strategic reality.'
      },
      {
        speakerId: 'bhishma',
        text: 'Blind prince, open your eyes! The cosmic form of time itself fills this hall! All kings, all weapons, all ages dissolve into his radiance! Fall at his lotus feet while the sun still shines upon your crown!',
        analysis: 'Desperate plea for existential de-escalation.'
      },
      {
        speakerId: 'duryodhana',
        text: 'Sorcery and optical illusions will not deceive the sons of Dhritarashtra! Sound the conch shells! Mobilize the elephants at Kurukshetra!',
        analysis: 'Irrational hubris locking in the worst-case Nash equilibrium.'
      }
    ]
  },
  {
    roundNumber: 5,
    upaya: 'Ranabheri (BATNA Executed: The Kurukshetra Ruin)',
    escalationIndex: 100,
    agreementRate: 0,
    paretoStatus: 'Catastrophic Nash Equilibrium (War)',
    isParetoImproving: false,
    pandavaUtility: 20,
    kauravaUtility: 0,
    krishnaUtility: 22,
    territoryOffered: 'No Accord Reached. Total Military Mobilization.',
    speeches: [
      {
        speakerId: 'krishna',
        text: 'The embassy is concluded. Let the world witness: Krishna came to Hastinapura seeking peace, asking only for five humble villages to spare humanity from weeping. The pride of Duryodhana has chosen the cemetery over the kingdom. Let Dharma take its course upon the plains of Kurukshetra.',
        analysis: 'Diplomatic Post-Mortem: Krishna establishes moral and historical legitimacy before war.'
      }
    ]
  }
];

export async function runAIAgentTurn({
  scenarioId,
  currentRound,
  history,
  agentId,
  upayaStage,
  negotiationTerms
}) {
  const profile = AGENT_PROFILES[agentId];
  if (!profile) throw new Error(`Unknown agent: ${agentId}`);

  const systemPrompt = profile.systemPrompt;
  const recentHistory = history.slice(-4).map(h => `${h.speakerName}: "${h.text}"`).join('\n\n');

  const prompt = `Current Round: ${currentRound} of 5.
Negotiation Topic: ${negotiationTerms.territoryIssue}
Current Active Upaya Lever: ${upayaStage}
Current Conflict Escalation Level: ${negotiationTerms.escalationIndex}%

Recent Assembly Exchanges:
${recentHistory || 'The embassy opens. Krishna addresses the assembly of Hastinapura.'}

You are speaking as ${profile.name}.
State your response now.
Deliver your in-character dialogue (2-3 sentences), followed by a brief JSON object on a new line with your strategic assessment in this format:
{"speech": "Your dialogue here...", "strategicIntent": "1 sentence explaining tactical purpose", "deltaEscalation": -5 to +15, "agentUtility": 0 to 100}`;

  try {
    const response = await callGroqChat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 350
    });

    const raw = response.content;
    let parsedJson = null;
    let speech = raw;
    let intent = profile.archetype;
    let deltaEscalation = agentId === 'duryodhana' ? 12 : -4;
    let utility = 50;

    // Try finding JSON block
    const jsonMatch = raw.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      try {
        parsedJson = JSON.parse(jsonMatch[0]);
        speech = parsedJson.speech || raw.replace(jsonMatch[0], '').trim();
        intent = parsedJson.strategicIntent || intent;
        if (typeof parsedJson.deltaEscalation === 'number') deltaEscalation = parsedJson.deltaEscalation;
        if (typeof parsedJson.agentUtility === 'number') utility = parsedJson.agentUtility;
      } catch (e) {
        // Fallback to text cleanup
        speech = raw.replace(/\{[\s\S]*?\}/, '').trim() || raw;
      }
    }

    return {
      success: true,
      agentId,
      speakerName: profile.name,
      text: speech,
      analysis: intent,
      deltaEscalation,
      utility,
      isAiGenerated: true
    };
  } catch (err) {
    console.warn(`AI generation failed for ${agentId}, using canonical turn:`, err);
    // Find canonical turn
    const canonical = CANONICAL_ROUNDS[Math.min(currentRound - 1, CANONICAL_ROUNDS.length - 1)];
    const canonicalSpeech = canonical.speeches.find(s => s.speakerId === agentId) || canonical.speeches[0];

    return {
      success: true,
      agentId,
      speakerName: AGENT_PROFILES[canonicalSpeech.speakerId].name,
      text: canonicalSpeech.text,
      analysis: canonicalSpeech.analysis,
      deltaEscalation: agentId === 'duryodhana' ? 15 : -5,
      utility: 50,
      isAiGenerated: false
    };
  }
}
