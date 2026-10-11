// Interactive Persona Dialogue Engine: User Converse with Sri Krishna
// Supports multiple user personas (Duryodhana, Karna, Yudhisthira, Dhritarashtra, Modern Diplomat)

import { callGroqChat } from './groqClient.js';

export const USER_PERSONAS = [
  {
    id: 'duryodhana',
    name: 'Crown Prince Duryodhana',
    tagline: 'Defend your unyielding claim to the Kuru throne',
    context: 'You sit on the throne of Hastinapura. Krishna stands before you with the Pandavas’ proposal for five humble villages. You believe concession invites contempt. You have 11 Akshauhinis and Karna by your side.',
    suggestedFirstMessage: 'Krishna, why do you plead for beggars? The Pandavas staked and lost everything. I will not yield even the soil pierced by a needle point!',
    badge: 'Kuru Sovereign',
    initialEscalation: 45
  },
  {
    id: 'karna',
    name: 'King Karna of Anga',
    tagline: 'Confront the chariot secret and the debt of sacred loyalty',
    context: 'Krishna has brought you into his private chariot on the outskirts of Hastinapura. He reveals your true birth as Kunti’s firstborn and offers you the imperial coronation as King of Aryavarta if you defect.',
    suggestedFirstMessage: 'Madhusudana, why reveal this cursed secret now? When I had no caste, Duryodhana gave me a kingdom. Can a king trade his sacred honor for a crown?',
    badge: 'Loyal Champion',
    initialEscalation: 30
  },
  {
    id: 'yudhisthira',
    name: 'Dharmaraja Yudhisthira',
    tagline: 'Instruct your peace ambassador on acceptable concessions',
    context: 'In Upaplavya council before Krishna departs for Hastinapura. You weigh the lives of millions against the humiliation of exile. Instruct Krishna on what terms you will accept.',
    suggestedFirstMessage: 'O Krishna, my soul trembles at the thought of war. If Duryodhana grants us five villages—Kushasthala, Vrikasthala, Asandhivat, Varanavata, and one more—we shall live as peaceful hermits.',
    badge: 'Righteous Elder',
    initialEscalation: 15
  },
  {
    id: 'dhritarashtra',
    name: 'King Dhritarashtra',
    tagline: 'A blind father caught between dynastic ruin and paternal indulgence',
    context: 'In the private chambers of Hastinapura. You know your son Duryodhana is headed toward destruction, but you cannot bear to break his heart or take away his pride.',
    suggestedFirstMessage: 'Krishna, you know the weakness of my heart. I am blind not merely in eyes, but in fatherly affection. Tell me how I can restrain Duryodhana without crushing him?',
    badge: 'Torn Monarch',
    initialEscalation: 35
  },
  {
    id: 'modern_diplomat',
    name: 'Modern Strategic Negotiator (Amrita Student)',
    tagline: 'Apply contemporary Game Theory and ZOPA to Mahabharata diplomacy',
    context: 'You are a conflict resolution researcher from Amrita Vishwa Vidyapeetham analyzing Krishna’s peace embassy through Harvard BATNA theory, Pareto optimality, and non-zero-sum game theory.',
    suggestedFirstMessage: 'Lord Krishna, from a game-theoretic view, Duryodhana’s perception of a zero-sum game prevents Pareto efficiency. How can we reframe the pie to expand mutual surplus?',
    badge: 'Academic Diplomat',
    initialEscalation: 20
  }
];

export async function sendPersonaDialogue({
  personaId,
  userMessage,
  chatHistory = [],
  currentEscalation = 30
}) {
  const persona = USER_PERSONAS.find(p => p.id === personaId) || USER_PERSONAS[0];

  const systemPrompt = `You are Sri Krishna, the divine statesman, philosopher, and peace envoy of the Mahabharata.
The user is speaking to you in the persona of: "${persona.name}" (${persona.context}).

Your objective:
1. Respond directly to their statement with profound wisdom, diplomatic brilliance, and historical/philosophical authenticity.
2. Mirror the diplomatic doctrine of the Four Upayas (Sāma - conciliation, Dāna - sacrifice/compromise, Bheda - exposing false premises/coalitions, Daṇḍa - unwavering moral deterrence).
3. If they are Duryodhana, challenge their pride and illusion of permanence.
4. If they are Karna, honor their nobility while dissecting the difference between true Dharma and blind personal obligation.
5. If they are Yudhisthira, balance his urge for peace with the Kshatriya duty to protect the righteous.
6. If they are a Modern Negotiator, weave ancient Chanakya/Mahabharata upayas with contemporary game theory (BATNA, Pareto efficiency, anchoring, emotional intelligence).

Format your reply:
Write 2-4 sentences of Krishna's direct spoken response.
Then, on a new line, provide a structured JSON block evaluating the user's move:
\`\`\`json
{
  "speech": "Your spoken dialogue as Krishna...",
  "negotiationTactic": "Classification of the user's move (e.g., Hardline Anchoring / Moral Appeal / Principled Bargaining)",
  "upayaEmployedByKrishna": "Sāma | Dāna | Bheda | Daṇḍa",
  "escalationDelta": -10 to +15,
  "dharmicScore": 0 to 100,
  "strategicCritique": "1 sentence of practical negotiation advice or Mahabharata lesson for the user"
}
\`\`\``;

  const formattedHistory = chatHistory.slice(-6).map(m => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: m.text
  }));

  formattedHistory.push({
    role: 'user',
    content: `[User as ${persona.name}]: ${userMessage}`
  });

  try {
    const res = await callGroqChat({
      messages: [
        { role: 'system', content: systemPrompt },
        ...formattedHistory
      ],
      temperature: 0.75,
      max_tokens: 500
    });

    const raw = res.content;
    let parsed = {
      speech: raw,
      negotiationTactic: 'Diplomatic Exchange',
      upayaEmployedByKrishna: 'Sāma (Conciliation)',
      escalationDelta: personaId === 'duryodhana' ? 6 : -4,
      dharmicScore: 65,
      strategicCritique: 'Every negotiation requires balancing immediate pride against long-term catastrophe.'
    };

    // Extract JSON block
    const jsonMatch = raw.match(/```json([\s\S]*?)```/) || raw.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        const data = JSON.parse(jsonStr);
        parsed = {
          speech: data.speech || raw.replace(jsonMatch[0], '').trim(),
          negotiationTactic: data.negotiationTactic || parsed.negotiationTactic,
          upayaEmployedByKrishna: data.upayaEmployedByKrishna || parsed.upayaEmployedByKrishna,
          escalationDelta: typeof data.escalationDelta === 'number' ? data.escalationDelta : parsed.escalationDelta,
          dharmicScore: typeof data.dharmicScore === 'number' ? data.dharmicScore : parsed.dharmicScore,
          strategicCritique: data.strategicCritique || parsed.strategicCritique
        };
      } catch (err) {
        // Fallback cleanup
        parsed.speech = raw.replace(/```json[\s\S]*?```/g, '').replace(/\{[\s\S]*?\}/g, '').trim() || raw;
      }
    }

    return {
      success: true,
      ...parsed
    };
  } catch (err) {
    console.warn('Groq persona dialogue call failed, using heuristic response:', err);
    // Heuristic contextual fallback
    return getHeuristicPersonaResponse(personaId, userMessage);
  }
}

function getHeuristicPersonaResponse(personaId, userMessage) {
  if (personaId === 'duryodhana') {
    return {
      success: true,
      speech: 'You speak of needle points, Suyodhana, yet you forget that the earth does not belong to your anger. Sovereignty without justice is a torch carried into a dry hayfield. If you stake the lives of your hundred brothers upon false pride, the river of blood at Kurukshetra will drown not your enemies, but your own name for eternity.',
      negotiationTactic: 'Zero-Sum Pride Anchoring',
      upayaEmployedByKrishna: 'Daṇḍa (Moral Deterrence)',
      escalationDelta: 10,
      dharmicScore: 20,
      strategicCritique: 'Refusing minimal concessions locks the opponent into their BATNA, guaranteeing mutual loss.'
    };
  }
  if (personaId === 'karna') {
    return {
      success: true,
      speech: 'Karna, your heart is noble, and your loyalty shines like the morning sun. Yet consider: friendship given to support injustice ceases to be virtue and becomes complicity. If a friend walks blindfolded toward a precipice, is it true love to walk over the edge beside him, or to seize his hand and pull him back?',
      negotiationTactic: 'Identity & Gratitude Anchor',
      upayaEmployedByKrishna: 'Bheda & Sāma',
      escalationDelta: -5,
      dharmicScore: 85,
      strategicCritique: 'Loyalty without ethical boundaries traps the negotiator into defending irrational positions.'
    };
  }
  if (personaId === 'yudhisthira') {
    return {
      success: true,
      speech: 'Dharmaraja, your desire to avoid bloodshed is the very heartbeat of wisdom. I shall lay five villages before the Kuru elders. Yet know this: peace cannot be bought at the price of cowardice. If we bend until our backs break, tyranny learns only that righteousness has no teeth.',
      negotiationTactic: 'Concession Flexibility',
      upayaEmployedByKrishna: 'Sāma & Strategic Framing',
      escalationDelta: -8,
      dharmicScore: 95,
      strategicCritique: 'A minimal viable offer clarifies the moral battlefield, exposing the opponent’s greed.'
    };
  }
  return {
    success: true,
    speech: 'In every human conflict, the greatest illusion is that one party can destroy the other and emerge unhurt. True statecraft expands the realm of mutual survival before pride burns the pavilion.',
    negotiationTactic: 'Integrative Bargaining Inquiry',
    upayaEmployedByKrishna: 'Sāma (Philosophical Conciliation)',
    escalationDelta: -5,
    dharmicScore: 88,
    strategicCritique: 'Reframing fixed-pie disputes into shared survival criteria unlocks hidden Pareto improvements.'
  };
}
