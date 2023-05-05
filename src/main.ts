import { Page, getPages } from './pages.js'
import { genVecStore } from './lang.js'
import * as dotenv from 'dotenv';
import * as fs from 'fs';

(async () => {
    dotenv.config();

    let pages;
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

    console.log({ pages });

    // TODO add in page title, ID, path, etc
    const storage = await genVecStore(pages);
    console.log({ storage }); 
})();