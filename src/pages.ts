import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import * as dotenv from 'dotenv';

export type Page = {
  id: string;
  title: string;
  content: string;
}

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

async function getAllPageIds() {
  const { results } = await notion.search({
    filter: {
      value: "page",
      property: "object",
    }
  });

  const pageIds = results.map((page) => page.id);  
  return pageIds;
}

async function getAllPageContent(pageIds: string[]) {
  
  const n2m_calls = pageIds.map(id => n2m.pageToMarkdown(id));
  // const pagePropsCalls = pageIds.map(id => notion.pages.retrieve({ page_id: id }));
  
  const blocksRes = await Promise.allSettled(n2m_calls);
  // const pageProps = await Promise.all(pagePropsCalls);

  // { status: 'rejected' } => { status: 'rejected', value: undefined }
  const blocks = blocksRes.map(b => b.status === 'fulfilled' ? b.value : null);
  const pageContent = blocks.map(page => page ? n2m.toMarkdownString(page) : null);

  // const pageTitles = pageProps.map(page => page.properties.title.title[0].plain_text);

  console.log(pageContent);

  if (pageContent.length !== pageIds.length) {
    throw new Error('Uncaught exception: number of page content and page IDs do not match');
  }

  return pageContent.map((content, i) => ({ id: pageIds[i], title: '', content }));

  /*
    for (const pageId of pageIds) {
    const mdblocks = await n2m.pageToMarkdown(pageId);
    const pageContentText = n2m.toMarkdownString(mdblocks);

    const page = await notion.pages.retrieve({ page_id: pageId });
    const pageTitle = page.properties.title.title[0].plain_text;

    pages.push({
      id: pageId,
      title: pageTitle,
      content: pageContentText,
    });
  }
  */

  // for (const id of pageIds) {
  //   const mdBlocks = await n2m.pageToMarkdown(id);
  //   const mdString = n2m.toMarkdownString(mdBlocks);
  //   console.log(mdString);
  //   pageContent.push(mdString);
  // }

  // return pageContent;
}


export async function getPages(): Promise<Page[]> {
    const pageIds = await getAllPageIds();
    console.log({ pageIds });

    // loop over each page ID and call getPageContent() on each
    const pages = await getAllPageContent(pageIds);

    // debugging! 
    // console.log(pages.length);
    //pages.forEach(str => console.log(str));

    return pages;
}
