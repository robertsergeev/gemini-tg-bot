const { GoogleGenerativeAI } = require("@google/generative-ai");
const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");

dotenv.config();
const bot = new TelegramBot(process.env.TG_API_KEY, { polling: true });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function makePrompt(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    try {
        const result = await model.generateContent([prompt]);
        return result.response.text();
    } catch (err) {
        console.log(err.status);
        return "Произошла какая-то ошибка";
    }
}

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    const geminiResponse = await makePrompt(text);

    await bot.sendMessage(chatId, geminiResponse);
});
