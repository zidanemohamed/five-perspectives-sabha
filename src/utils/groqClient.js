// Intelligent Groq LLM Client with Multi-Key Rotation and Fallbacks
// Strategic Lessons from Mahabharata

const GROQ_KEYS = [
  import.meta.env.VITE_GROQ_KEY_1,
  import.meta.env.VITE_GROQ_KEY_2,
  import.meta.env.VITE_GROQ_KEY_3
].filter(Boolean);

let currentKeyIndex = 0;

export function getActiveKeyIndex() {
  return currentKeyIndex;
}

export async function callGroqChat({
  messages,
  temperature = 0.7,
  max_tokens = 600,
  jsonMode = false
}) {
  if (GROQ_KEYS.length === 0) {
    throw new Error('No Groq API keys configured.');
  }

  const attempts = GROQ_KEYS.length;

  for (let attempt = 0; attempt < attempts; attempt++) {
    const key = GROQ_KEYS[currentKeyIndex];

    try {
      const payload = {
        model: 'qwen/qwen3.8-27b',
        messages,
        temperature,
        max_tokens
      };

      if (jsonMode) {
        payload.response_format = {
          type: 'json_object'
        };
      }

      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (
        response.status === 429 ||
        response.status === 401 ||
        response.status >= 500
      ) {
        console.warn(
          `Groq Key index ${currentKeyIndex} returned status ${response.status}. Rotating key...`
        );

        currentKeyIndex =
          (currentKeyIndex + 1) % GROQ_KEYS.length;

        continue;
      }

      const data = await response.json();

      if (data.error) {
        console.warn(
          `Groq API error on key ${currentKeyIndex}:`,
          data.error
        );

        currentKeyIndex =
          (currentKeyIndex + 1) % GROQ_KEYS.length;

        continue;
      }

      const content =
        data.choices?.[0]?.message?.content || '';

      return {
        success: true,
        content,
        keyIndex: currentKeyIndex
      };
    } catch (err) {
      console.error(
        `Fetch failure with key index ${currentKeyIndex}:`,
        err
      );

      currentKeyIndex =
        (currentKeyIndex + 1) % GROQ_KEYS.length;
    }
  }

  throw new Error(
    'All Groq API keys exhausted or network unavailable.'
  );
}