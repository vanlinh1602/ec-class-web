import Together from 'together-ai';

import { Courses } from '@/features/courses/types';

const together = new Together({
  apiKey: process.env.NEXT_PUBLIC_TOGETHER_API_KEY,
});

export type Message = {
  content: string;
  promt?: string;
  role: 'system' | 'user' | 'assistant' | 'tool';
};

export const removeAccents = (text: string): string =>
  text
    .replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A')
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    .replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E')
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    .replace(/I|Í|Ì|Ĩ|Ị/g, 'I')
    .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    .replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O')
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    .replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U')
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    .replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y')
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    .replace(/Đ/g, 'D')
    .replace(/đ/g, 'd')
    .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '')
    .replace(/\u02C6|\u0306|\u031B/g, '');

const detectContent = (content: string, courses: Courses[]) => {
  const regex = [/tu van/, /khoa hoc/, /lo trinh/, /hoc phi/];
  const text = removeAccents(content.toLowerCase());
  if (regex.some((r) => r.test(text))) {
    return `Bạn là chuyên gia tư vấn cho học viên, trung tâm có các khóa học và học phí như sau:
    ${courses
      .map((c) => `Khóa học ${c.name} với học phí ${c.price}$`)
      .join(', ')}. Bạn hãy tư vấn cho học viên với những câu hỏi của họ.`;
  }
  return '';
};

export const createMessage = async (
  content: string,
  currentMessage: Message[],
  courses: Courses[]
): Promise<Message> => {
  const messages: Message[] = [];
  const hasPromt = currentMessage.some((m) => m.promt);
  let promt = '';
  if (!hasPromt) {
    promt = detectContent(content, courses);
    if (promt) {
      messages.push({ content: promt, role: 'user' });
    }
  }

  messages.push(
    ...currentMessage.map((m) => ({
      role: m.role,
      content: m.promt || m.content,
    }))
  );

  messages.push({ content: content, role: 'user' });

  const response = await together.chat.completions.create({
    messages,
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
  return {
    content: textRespone,
    role: 'assistant',
    promt: promt ? promt : undefined,
  };
};
