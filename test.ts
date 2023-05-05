import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import * as dotenv from 'dotenv';
const fs = require('fs');

dotenv.config();

console.log(process.env.NOTION_API_KEY);

export type Page = {
  id: string;
  title: string;
  content: string;
}

const notion = new Client ({
  auth: process.env.NOTION_TOKEN,
})

;(async () => {
  const listUsersresponse = await notion.users.list({});
})()

// process.env.PAGE_ID_ROOT ( '71aad8e7270847d2bfa9ced0f913e6f0' )

// const notion = new Client({
//   auth: process.env.NOTION_API_KEY,
// });

// // passing notion client to the option
// const n2m = new NotionToMarkdown({ notionClient: notion });

// (async () => {
//   const mdblocks = await n2m.pageToMarkdown("target_page_id");
//   const mdString = n2m.toMarkdownString(mdblocks);
// })();

