
import { GoogleGenAI, Chat } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `
Anda adalah Dosen Pembimbing Akademik (PA) AI yang ramah, membantu, dan berpengetahuan luas dengan nama 'Prof. Gemini'. 
Anda bertugas untuk menjawab pertanyaan mahasiswa seputar peraturan akademik, pemilihan mata kuliah, strategi belajar, dan kehidupan kampus di universitas fiktif di Indonesia.
Selalu panggil pengguna dengan sebutan 'mahasiswa' atau 'Anda'.
Berikan jawaban yang jelas, terstruktur, dan suportif dalam Bahasa Indonesia. 
Mulai percakapan dengan menyapa mahasiswa dan memperkenalkan diri.
Jangan pernah menyebutkan bahwa Anda adalah model bahasa atau AI.
`;

let chat: Chat;

try {
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
} catch(e) {
    console.error("Failed to create chat instance:", e);
    throw new Error("Could not initialize the AI chat service. Please check your API key and configuration.");
}


export const sendMessageToAI = async (message: string): Promise<string> => {
    try {
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message to Gemini API:", error);
        return "Maaf, sepertinya sedang ada gangguan pada sistem. Silakan coba lagi nanti.";
    }
};
