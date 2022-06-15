import dotenv from "dotenv";
import { chromium, devices } from 'playwright-chromium';
import cron from "node-cron";
import database from "./db/schema";
import { readFileSync, rmSync } from "fs";
import Twit from "twit";
import mongoose from 'mongoose';
import { check, save } from './utilities/report';
import { CheckModel } from './models/check';

dotenv.config();
const device = devices["Desktop Chrome"];
const T = new Twit({ consumer_key: process.env.CONSUMER_KEY, consumer_secret: process.env.CONSUMER_SECRET, access_token: process.env.ACCESS_TOKEN, access_token_secret: process.env.ACCESS_TOKEN_SECRET });

cron.schedule(`* * */1 * *`, () => main());

async function main() {
    try {
        console.log("Checking...")
        await mongoose.connect(process.env.DATABASE as string);

        const browser = await chromium.launch({ chromiumSandbox: false });
        const context = await browser.newContext({ acceptDownloads: true, ...device });
    
        let report : CheckModel = await check(context);
        await browser.close();

        if (report.status == false) {
            await save(report.url);

            let image = readFileSync('temp/output.png', { encoding: 'base64' });

            T.post('media/upload', { media_data: image }, (err, data) => {
                if (err) throw Error(err);
    
                let text = `${report.label}`;
                let tweet = {
                    status: text + `\n\n    ~ 🇱🇰  STATUS ID ${Math.floor(Math.random()*1000)} ~\n[#PowerCutLK #SriLanka #lka #ceb]`,
                    media_ids: [data.media_id_string]
                }
                T.post('statuses/update', tweet, async (err) => {
                    if (err) throw Error(err);
    
                    rmSync('temp', { recursive: true, force: true });
                    await database.create({ label: report.label, url: report.url });
                });
            });
        };
    } catch (error) {
       console.error(error);
    }
}
