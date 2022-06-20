import dotenv from "dotenv";
import { chromium, devices } from 'playwright-chromium';
import cron from "node-cron";
import { readFile, readdirSync } from "fs";
import Twit from "twit";
import mongoose from 'mongoose';
import { check, save } from './utilities/report';
import { ReportModel } from './models/ReportModel';
import moment from "moment-timezone";
import { Webhook } from "discord-webhook-node";
import { message } from "./utilities/message";

dotenv.config();
const device = devices["Desktop Chrome"];
const hook = new Webhook(process.env.DISCORDDEV as string);
const T = new Twit({ consumer_key: process.env.CONSUMER_KEY, consumer_secret: process.env.CONSUMER_SECRET, access_token: process.env.ACCESS_TOKEN, access_token_secret: process.env.ACCESS_TOKEN_SECRET });

console.log(`[PowerCutLK] : Service Started`)
cron.schedule('0 0-23 * * *', () => main(), { scheduled: true, timezone: "Asia/Colombo" });

async function main() {
    try {
        console.log(`[PowerCutLK] : ${moment.utc((new Date).getTime()).tz('Asia/Colombo').format('LLLL')}`)
        await mongoose.connect(process.env.DATABASE as string);

        const browser = await chromium.launch({ chromiumSandbox: false });
        const context = await browser.newContext({ acceptDownloads: true, ...device });
    
        let report : ReportModel = await check(context);
        await browser.close();


        if (report.status == false) {
            await save(report.url);
            queue(report);
        };
    } catch (error) {
       console.error(error);
    }

    function queue(report) {
        setTimeout(() => {
            readFile(`temp/output/report.${readdirSync('temp/report').length}-output.png`, async (err, data) => {
                if (err) {
                   console.log("it does not exuist")
                    queue(report);
                } else {
                    await message(T, hook, report);
                }
            });
        }, 1000);
    }
}
