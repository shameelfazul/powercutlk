import { chromium, devices } from 'playwright-chromium';
import { readFile, readdirSync } from "fs";
// @ts-ignore
import Twit from "twit";
import mongoose from 'mongoose';
import { check, save } from './utilities/report';
import { ReportModel } from './models/ReportModel';
// @ts-ignore
import moment from "moment-timezone";
import { Webhook } from "discord-webhook-node";
import { message } from "./utilities/message";

const device = devices["Desktop Chrome"];
const hook = new Webhook(process.env.DISCORD as string);
const T = new Twit({ consumer_key: process.env.CONSUMER_KEY, consumer_secret: process.env.CONSUMER_SECRET, access_token: process.env.ACCESS_TOKEN, access_token_secret: process.env.ACCESS_TOKEN_SECRET });

console.log(`[PowerCutLK] : Service Started`)
main()

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
        } else {
            console.log("[PowerCutLK] : Report is up-to-date")
            process.exit(0)
        };
    } catch (error) {
        console.error(error);
        process.exit(0)
    }

    function queue(report : ReportModel) {
        setTimeout(() => {
            readFile(`temp/output/report.${readdirSync('temp/report').length}-output.png`, async (err, data) => {
                if (err) {
                   console.log(`[PowerCutLK] : Queueing : ${readdirSync('temp/output').length}/${readdirSync('temp/report').length}`);
                    queue(report);
                } else {
                    await message(T, hook, report);
                }
            });
        }, 1000);
    }
}
