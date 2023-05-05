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
  
export const loadVecStore = () => {
    return HNSWLib.load(
        process.env.VEC_STORE_DIR,
        new OpenAIEmbeddings()
    );
}

export const genVecStore = async (pages: string[]) => {
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const docs = await textSplitter.createDocuments(pages);

    console.log('Number of chunks: ', docs.length);

    // Create a vector store from the documents. This is currently in memory
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    return vectorStore;

    /*
    export const run = async () => {
  // Create a vector store through any method, here from texts as an example
  const vectorStore = await HNSWLib.fromTexts(
    ["Hello world", "Bye bye", "hello nice world"],
    [{ id: 2 }, { id: 1 }, { id: 3 }],
    new OpenAIEmbeddings()
  );

  // Save the vector store to a directory
  const directory = "your/directory/here";
  await vectorStore.save(directory);

  // Load the vector store from the same directory
  const loadedVectorStore = await HNSWLib.load(
    directory,
    new OpenAIEmbeddings()
  );

  // vectorStore and loadedVectorStore are identical

  const result = await loadedVectorStore.similaritySearch("hello world", 1);
  console.log(result);
  */
}