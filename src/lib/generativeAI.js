
// import { GoogleGenerativeAI } from "google-generative-ai";

// const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash-latest",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   maxOutputTokens: 8192,
//   responseMimeType: "application/json",
// };

// const generateRecommendations = async (data) => {
//   const chatSession = model.startChat({
//     generationConfig,
//     history: [
//       {
//         role: "user",
//         parts: [
//           {
//             text: `
//               Esto es el resumen de movimientos y ventas de la semana ${JSON.stringify(data)}
//               Eres un experto en modelo de negocios que ayuda a la empresa a mejorar sus ventas a través de recomendaciones.
//               Debes proporcionar respuestas precisas y concisas basadas en las órdenes proporcionadas.
//               Responde solo con la información relevante y necesaria.
//             `,
//           },
//         ],
//       },
//     ],
//   });

//   const result = await chatSession.sendMessage({
//     role: "user",
//     content: `
//       Esto es el resumen de movimientos y ventas de la semana ${JSON.stringify(data)}
//       Eres un experto en modelo de negocios que ayuda a la empresa a mejorar sus ventas a través de recomendaciones.
//       Debes proporcionar respuestas precisas y concisas basadas en las órdenes proporcionadas.
//       Responde solo con la información relevante y necesaria.
//     `,
//   });

//   return result.messages[0]?.content || "No response received";
// };

// module.exports = {
//   generateRecommendations,
// };
