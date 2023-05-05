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

// (async () => {
//   const listUsersresponse = await notion.users.list({});
//   console.log(listUsersresponse);
// })();

// async function getAllIDPage(auth: string):

// https://www.notion.so/shreypandya/Sandbox-71aad8e7270847d2bfa9ced0f913e6f0?pvs=4

async function getAllPageIds() {
  const { results } = await notion.search({});

  const pages = results.filter(
    (result) =>
      result.object === "page" &&
      //@ts-ignore
      result.parent.type === "workspace" &&
      //@ts-ignore
      result.parent.workspace === true
  );

  console.log(pages)

  const pageIds = pages.map((page) => page.id);  
  return pageIds;
}

// async function getPages(): Promise <Page[]> {
//     const pageIds = await getAllPageIds();

//   // loop over each page ID and call getPageContent() on each
//     const pages = await getAllPageContent(pageIds);
    
//     return pages;
// }


// const notion = new Client({
//   auth: process.env.NOTION_API_KEY,
// });

// // passing notion client to the option
// const n2m = new NotionToMarkdown({ notionClient: notion });

// (async () => {
//   const mdblocks = await n2m.pageToMarkdown("target_page_id");
//   const mdString = n2m.toMarkdownString(mdblocks);
// })();

(async () => {
  await getAllPageIds()
})();
