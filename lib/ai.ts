import Together from 'together-ai';

const together = new Together({
  apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY,
});

export type Message = {
  content: string;
  role: 'system' | 'user' | 'assistant' | 'tool';
};

export const createMessage = async (
  content: string,
  currentMessage: Message[]
) => {
  const response = await together.chat.completions.create({
    messages: [...currentMessage, { content, role: 'user' }],
    model: 'meta-llama/Llama-Vision-Free',
    max_tokens: 512,
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    repetition_penalty: 1,
    stop: ['<|eot_id|>', '<|eom_id|>'],
    stream: true,
  });
  let textRespone: string = '';
  for await (const token of response) {
    textRespone += token.choices[0]?.delta?.content || '';
  }
  return textRespone;
};
