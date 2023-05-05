import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";

export const run = async () => {
    // Initialize the LLM 
    const GPT = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const text = fs.readFileSync("state_of_the_union.txt", "utf8");
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 200 });
    const docs = await textSplitter.createDocuments([text]);

    // Create a vector store from the documents. This is curretly in memory
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

    // Create a chain that uses the OpenAI LLM and HNSWLib vector store.
    const chain = RetrievalQAChain.fromLLM(GPT, vectorStore.asRetriever());
    const res = await chain.call({
        query: "What did the president say about Justice Breyer?",
    });
    console.log({ res });
    /*
    {
        res: {
        text: 'The president said that Justice Breyer was an Army veteran, Constitutional scholar,
        and retiring Justice of the United States Supreme Court and thanked him for his service.'
        }
    }
    */
};
  
  
export const genVecStore = async (pages: string[]) => {
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const docs = await textSplitter.createDocuments(pages);

    console.log(docs);

    // Create a vector store from the documents. This is curretly in memory
    //const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    //return vectorStore;
}