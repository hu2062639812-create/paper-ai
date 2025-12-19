
import { GoogleGenAI, Type } from "@google/genai";
import { ProcessingResult } from "../types";

const SYSTEM_INSTRUCTION = `你是一位顶级的学术论文编辑，擅长润色论文并降低AI写作痕迹。请对用户提供的学术段落进行深度润色。

【降低AI痕迹要求】
1. 替换常见AI高频词汇：如 "significantly" 替换为 "substantially", "notable" 替换为 "salient", "enhance" 替换为 "augment" 或 "refine" 等更具学术多样性的词汇。
2. 增加句式变化：避免连续使用简单的陈述句，灵活运用从句、分词短语及倒装句，提升文本韵律感。
3. 优化学术连接词：替换机械的 "Furthermore" 为 "Additionally", "Moreover", "In addition to this" 等，确保逻辑连贯且不刻意。
4. 引入领域特定术语：将通用的、口语化的表达替换为精准的学科专业术语。

【保持学术质量要求】
1. 严禁改变原意和数据。
2. 保持论证逻辑的严密性。
3. 符合顶级学术期刊的写作规范。
4. 保留原有的核心专业术语。

【输出格式要求】
必须返回一个符合以下结构的 JSON 对象：
{
  "paragraphs": [
    {
      "original": "原始段落文本",
      "polished": "润色后的段落文本",
      "explanations": ["修改说明1", "修改说明2"]
    }
  ]
}`;

export const polishAcademicText = async (text: string): Promise<ProcessingResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: text,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            paragraphs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  polished: { type: Type.STRING },
                  explanations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["original", "polished", "explanations"]
              }
            }
          },
          required: ["paragraphs"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    return JSON.parse(resultText) as ProcessingResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
