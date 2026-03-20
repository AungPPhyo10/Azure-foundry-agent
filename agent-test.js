import { AzureOpenAI } from "openai";
import 'dotenv/config'; 

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: "2024-10-21", 
});

async function main() {
  try {
    const agentId = process.env.AGENT_ID; 

    console.log("1. Creating a new conversation thread...");
    const thread = await client.beta.threads.create();

    console.log("2. Adding your query to the thread...");
    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: "Tell me about the SilverNexus Studio game launch.", 
    });

    console.log("3. Waking up the Agent and waiting for a response...");

    const run = await client.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: agentId,
    });


    if (run.status === 'completed') {
      const messages = await client.beta.threads.messages.list(run.thread_id);
      
      const agentResponse = messages.data[0].content[0].text.value;
      console.log("\n=== AGENT RESPONSE ===");
      console.log(agentResponse);
      
      const annotations = messages.data[0].content[0].text.annotations;
      console.log("\n=== RAW ANNOTATIONS (Citations) ===");
      console.log(JSON.stringify(annotations, null, 2));

    } else {
      console.log("\nAgent failed to complete. Final status:", run.status);
    }

  } catch (error) {
    console.error("Debug Error Caught:", error);
  }
}

main();
