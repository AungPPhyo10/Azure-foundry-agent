import { AzureOpenAI } from "openai";
import 'dotenv/config';

const endpoint = "https://aungp10-9817-resource.cognitiveservices.azure.com/";
const modelName = "gpt-4.1";
const deployment = "gpt-4.1";

export async function main() {

  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const apiVersion = "2024-04-01-preview";
  const options = { endpoint, apiKey, deployment, apiVersion }

  const client = new AzureOpenAI(options);

  const response = await client.chat.completions.create({
    messages: [
      { role:"system", content: "You are a helpful assistant." },
      { role:"user", content: "I am going to Vietnam, Da Nang. What should I see?" }
    ],
    max_completion_tokens: 13107,
      temperature: 0.8,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: modelName
  });

  if (response?.error !== undefined && response.status !== "200") {
    throw response.error;
  }
  console.log(response.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});