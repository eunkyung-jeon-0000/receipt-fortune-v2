import { GoogleGenerativeAI } from "@google/generativeai";

// 1. 환경 변수 설정 (Vite 표준 방식)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

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
  try {
    // 2. 가장 안정적인 모델인 gemini-1.5-flash 사용
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = `
      당신은 '영수증 점성술사'이자 '자본주의 무속인'이다.
      이미지가 제공된다면 이미지 속의 텍스트를 읽고, 영수증의 구겨진 정도나 글씨체에서도 기운을 느껴라.
      
      [답변 규칙]
      1. 매우 신비롭고 엉뚱하며 유머러스한 말투를 사용해라.
      2. 다음 4가지 항목을 반드시 포함해라:
         - 영수증의 기운: (전반적인 느낌)
         - 전생의 흔적: (구매 품목 중 하나를 전생의 물건과 연결)
         - 오늘의 예언: (말도 안 되는 엉뚱한 미래 예측)
         - 행운의 아이템: (주변에서 찾을 수 있는 사소한 물건)
    `;

    const prompt = "이 영수증을 분석해서 나의 운세를 점쳐줘.";

    // 3. 이미지 데이터 처리 및 요청
    if (data.image) {
      const result = await model.generateContent([
        systemInstruction,
        prompt,
        {
          inlineData: {
            data: data.image.data,
            mimeType: data.image.mimeType,
          },
        },
      ]);
      return result.response.text();
    } else {
      // 이미지가 없을 때의 처리
      const result = await model.generateContent([systemInstruction, prompt]);
      return result.response.text();
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "복채(API 키)가 부족한 것인지, 우주의 기운이 어지럽구나. (에러가 발생했습니다. Vercel 설정을 확인해주세요!)";
  }
}
