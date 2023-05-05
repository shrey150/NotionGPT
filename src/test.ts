import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import * as dotenv from 'dotenv';

dotenv.config();

export type Page = {
  id: string;
  title: string;
  content: string;
}

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
  const pageContent = [];
  
  for (const id of pageIds) {
    const mdBlocks = await n2m.pageToMarkdown(id);
    const mdString = n2m.toMarkdownString(mdBlocks);
    pageContent.push(mdString);
  }

  return pageContent;
}


async function getPages(): Promise <Page[]> {
    const pageIds = await getAllPageIds();
    console.log({ pageIds });

  // loop over each page ID and call getPageContent() on each
    const pages = await getAllPageContent(pageIds);
    console.log({ pages });

    // debugging! 
    // console.log(pages.length);
    //pages.forEach(str => console.log(str));

    return pages;
}


// For testing
(async () => {
  await getPages()
})();
