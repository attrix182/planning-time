import { Injectable } from '@angular/core';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AiService {

  model:any;

  constructor() {
    this.initGenIA();
  }

  initGenIA() {
    const genAI = new GoogleGenerativeAI(environment.apiKeyGoogle);
    const generationConfig = {
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
      temperature: 0.9,
      top_p: 1,
      top_k: 32,
      maxOutputTokens: 100, // limit output
    };
    this.model = genAI.getGenerativeModel({
      model: 'gemini-pro', // or 'gemini-pro-vision'
      ...generationConfig,
    });
  }
}
