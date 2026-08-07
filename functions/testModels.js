const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

async function testModel(modelName) {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: ["Hello"],
    });
    console.log(`${modelName}: SUCCESS`);
  } catch (error) {
    console.error(`${modelName}: FAILED - ${error.message}`);
  }
}

async function run() {
  await testModel("gemini-1.5-flash");
  await testModel("gemini-2.5-flash");
  await testModel("gemini-2.0-flash");
  await testModel("gemini-1.5-flash-8b");
}
run();
