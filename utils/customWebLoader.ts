import type { CheerioAPI, load as LoadT } from 'cheerio';
import { Document } from 'langchain/document';
import { BaseDocumentLoader } from 'langchain/document_loaders';
import type { DocumentLoader } from 'langchain/document_loaders';
import axios from 'axios';

export class CustomWebLoader
  extends BaseDocumentLoader
  implements DocumentLoader
{
  constructor(public webPath: string) {
    super();
  }

  static async scrape(url: string): Promise<CheerioAPI> {
    const { load } = await CustomWebLoader.imports();
    const response = await axios.get(url);
    const html = response.data;
  
    return load(html);
  }

  async scrape(): Promise<CheerioAPI> {
    return CustomWebLoader.scrape(this.webPath);
  }

  async load(): Promise<Document[]> {
    const $ = await this.scrape();
    const content = $('body')
      .clone()
      .end()
      .text();
    const cleanedContent = content.replace(/\s+/g, ' ').trim();
    const contentLength = cleanedContent?.match(/\b\w+\b/g)?.length ?? 0;
    const metadata = { source: this.webPath, contentLength };

    return [new Document({ pageContent: cleanedContent, metadata })];
  }

  static async imports(): Promise<{
    load: typeof LoadT;
  }> {
    try {
      const { load } = await import('cheerio');
      return { load };
    } catch (e) {
      console.error(e);
      throw new Error(
        'Please install cheerio as a dependency with `npm install --save cheerio`',
      );
    }
  }
}
