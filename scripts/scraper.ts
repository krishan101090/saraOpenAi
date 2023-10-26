import type { SupabaseClient } from '@supabase/supabase-js';
import { Document } from 'langchain/document';
import { Embeddings, OpenAIEmbeddings } from 'langchain/embeddings';
import { SupabaseVectorStore } from 'langchain/vectorstores'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as fs from 'fs/promises';

import { CustomWebLoader } from '@/utils/customWebLoader';
import { supabaseClient } from '@/utils/supabaseClient';
import { urls } from '@/config/urls';

async function extractDataFromUrl(url: string): Promise<Document[]> {
  try {
    const loader = new CustomWebLoader(url);
    const docs = await loader.load();
    return docs;
  } catch (error) {
    console.error(`Error while extracting data from ${url}: ${error}`);
    return [];
  }
}

async function extractDataFromUrls(urls: string[]): Promise<Document[]> {
  const documents: Document[] = [];
  for (const url of urls) {
    const docs = await extractDataFromUrl(url);
    documents.push(...docs);
  }
  const json = JSON.stringify(documents);
  await fs.writeFile('scrappingData.json', json);
  return documents;
}

async function embedDocuments(
  client: SupabaseClient,
  docs: Document[],
  embeddings: Embeddings,
) {
  
  await SupabaseVectorStore.fromDocuments(client, docs, embeddings);
}

async function splitDocsIntoChunks(docs: Document[]): Promise<Document[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  });
  return await textSplitter.splitDocuments(docs);
}

(async function run(urls: string[]) {
  try {
    const rawDocs = await extractDataFromUrls(urls);
    const docs = await splitDocsIntoChunks(rawDocs);

    await embedDocuments(supabaseClient, docs, new OpenAIEmbeddings());
  } catch (error) {
    console.log('error occured:', error);
  }
})(urls);
