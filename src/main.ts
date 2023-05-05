import { Page, getPages } from './pages.js'
import { genVecStore, loadVecStore } from './lang.js'
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import * as dotenv from 'dotenv';
import * as fs from 'fs';

(async () => {
    dotenv.config();

    let pages: Page[];
    if (!fs.existsSync('data/pages.json')) {
        console.log("Data not found, fetching from Notion API");
        pages = await getPages();
        fs.writeFileSync('data/pages.json', JSON.stringify(pages));
    }
    else {
        console.log("Loading Notion docs data from disk");
        const data = fs.readFileSync('data/pages.json');
        pages = JSON.parse(data.toString()) as Page[];
    }

    console.log('Number of pages: ', pages.length);

    let storage: HNSWLib;
    if (!fs.existsSync('data/vecstore')) {
        storage = await genVecStore(pages.map(p => p.content));
        storage.save(process.env.VEC_STORE_DIR);
    }
    else {
        console.log("Loading vecstore from disk");
        storage = await loadVecStore();
    }

    // TODO add in page title, ID, path, etc
    console.log({ storage });
    
    const ans = await storage.similaritySearch("What are some shitty stocks to buy");
    console.log(ans);
})();