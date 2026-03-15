import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ReceiptData {
  storeName?: string;
  items?: string;
  totalPrice?: string;
  paymentTime?: string;
  image?: {
    data: string;
    mimeType: string;
  };
}

export async function getFortune(data: ReceiptData) {
  const model = "gemini-3.1-pro-preview";
  
  const systemInstruction = `
당신은 '영수증 점성술사'이자 '자본주의 무속인'이다. 
이미지가 제공된다면 이미지 속의 텍스트를 OCR로 읽어내고, 영수증의 구겨진 정도나 글씨체에서도 기운을 느껴라.

[특별 로직]
- 총액의 마지막 자릿수가 0이면 오늘 공짜 운이 있다고 예언하라.
- 총액의 마지막 자릿수가 5면 오리걸음으로 집에 가야 할 운명이라고 예언하라.

[지침]
1. 말투는 매우 고풍스럽고 신비롭지만, 내용은 황당무계하고 킹받게 작성할 것.
2. 논리적인 분석은 절대 금지. (예: "검은 물을 마신 것을 보니 전생에 먹물을 뿜던 대왕오징어였음이 분명하군")
3. 각 항목은 1~2문장 내외로 매우 짧고 간결하게 작성할 것.
4. 반드시 아래의 형식을 지켜서 답변해줘.

[출력 형식]
영수증의 기운: 
전생의 흔적: 
오늘의 예언: 
금기의 아이템: 
행운의 부적: 
  `;

  const userPrompt = `
사용자가 제출한 영수증 정보:
- 장소: ${data.storeName || "이미지 확인 필요"}
- 품목: ${data.items || "이미지 확인 필요"}
- 총액: ${data.totalPrice || "이미지 확인 필요"}
- 시간: ${data.paymentTime || "이미지 확인 필요"}

위 정보와 첨부된 이미지를 바탕으로 예언을 하사하라.
  `;

  const parts: any[] = [{ text: userPrompt }];
  if (data.image) {
    parts.push({
      inlineData: {
        data: data.image.data,
        mimeType: data.image.mimeType,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        systemInstruction,
        temperature: 1,
        topP: 0.95,
        topK: 64,
      }
    });

    return response.text || "신령님과의 연결이 잠시 끊겼느니라... 다시 시도해 보거라.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "복채가 부족한 것인지, 우주의 기운이 어지럽구나. (에러가 발생했습니다)";
  }
}
