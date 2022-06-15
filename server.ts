import dotenv from "dotenv";
import { chromium, devices } from 'playwright-chromium';
import cron from "node-cron";
import database from "./db/schema";
import { readFileSync, rmSync } from "fs";
import Twit from "twit";
import mongoose from 'mongoose';
import { check, save } from './utilities/report';
import { CheckModel } from './models/check';
import moment from "moment-timezone";
import { Webhook } from "discord-webhook-node";

dotenv.config();
const device = devices["Desktop Chrome"];
const hook = new Webhook(process.env.DISCORD as string);
const T = new Twit({ consumer_key: process.env.CONSUMER_KEY, consumer_secret: process.env.CONSUMER_SECRET, access_token: process.env.ACCESS_TOKEN, access_token_secret: process.env.ACCESS_TOKEN_SECRET });

console.log(`[PowerCutLK] : Service Started`)
cron.schedule(`* */1 * * *`, () => main(), { scheduled: true, timezone: "Asia/Colombo" });

async function main() {
    try {
        console.log(`[PowerCutLK] : ${moment.utc((new Date).getTime()).tz('Asia/Colombo').format('LLLL')}`)
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

                    hook.setUsername('PowerCut_LK'); //Overrides the default webhook username
                    hook.setAvatar('https://pbs.twimg.com/profile_images/1536671063983128577/qwofMeAi_400x400.jpg');
                    await hook.sendFile('temp/output.png');
    
                    rmSync('temp', { recursive: true, force: true });
                    await database.create({ label: report.label, url: report.url });
                });
            });
        };
    } catch (error) {
       console.error(error);
    }
}
