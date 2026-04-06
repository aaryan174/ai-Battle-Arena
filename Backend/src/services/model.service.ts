import {ChatGoogle} from "@langchain/google"
import { ChatMistralAI } from "@langchain/mistralai"
import { ChatCohere } from "@langchain/cohere"
import aiConfig from "../config/config.js"




 export const geminiModel = new ChatGoogle({
    model: "gemini-flash-latest",
    apiKey: aiConfig.GOOGLE_API_KEY,
});


export const mistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: aiConfig.MISTRAL_API_KEY
})

export const choreModel = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: aiConfig.COHERE_API_KEY
})




