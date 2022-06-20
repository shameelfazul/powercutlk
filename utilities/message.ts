import Twitter from "twit";
import { readdirSync, readFileSync, rmSync } from "fs";
import database from "../db/schema";
import { ReportModel } from "../models/ReportModel";
import { Webhook } from "discord-webhook-node";

export async function message(twitterClient : Twitter, discordWebhook : Webhook, report : ReportModel) {
    await tweet(twitterClient, report);
    await discord(discordWebhook, report);

    await database.create({ label: report.label, url: report.url });
}


async function tweet(client : Twitter, report : ReportModel) {
    let imageIds : string[] = [];

    readdirSync("temp/output").forEach(async (name) => {
        let image = readFileSync(`temp/output/${name}`, { encoding: 'base64' });
        let count = readdirSync("temp/output").length;

        client.post('media/upload', { media_data: image }, (err, data) => {
            if (err) throw Error(err);

            imageIds.push(data.media_id_string);

            if (imageIds.length == count) {
                let tweet = {
                    status: report.label + `\n\n    ~ 🇱🇰  STATUS ID ${Math.floor(Math.random()*1000)} ~\n[#PowerCutLK #SriLanka #lka #ceb]`,
                    media_ids: imageIds.reverse()
                }

                client.post('statuses/update', tweet, async (err) => { if (err) throw Error(err) });
            };
        });
    });
};


async function discord(webhook : Webhook, report : ReportModel) {
    webhook.setUsername('PowerCut_LK');
    webhook.setAvatar('https://pbs.twimg.com/profile_images/1536671063983128577/qwofMeAi_400x400.jpg');
    await webhook.send(report.label);

    readdirSync("temp/output").forEach(async (name) => {
        await webhook.sendFile(`temp/output/${name}`);
    });
};