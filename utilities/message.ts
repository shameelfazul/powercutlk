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
    type ImageId = {
        Id: string;
        Index: number
    };

    let ImageIds : ImageId[] = [];

    readdirSync("temp/output").forEach(async (name) => {
        let image = readFileSync(`temp/output/${name}`, { encoding: 'base64' });
        let count = readdirSync("temp/output").length;

        client.post('media/upload', { media_data: image }, (err, data) => {
            if (err) throw Error(err);

            ImageIds.push({ Id: data.media_id_string, Index: Number(name.slice(7, 8))})

            if (ImageIds.length == count) {
                let mediaIDs : string[] = ImageIds.sort((a, b) => a.Index - b.Index).map(x => x.Id);

                client.post('statuses/update', 
                {
                    status: `${report.label}\n\n--- ⬇️ More Schedules Down ⬇️ ---\n\n    ~ 🇱🇰  STATUS ID ${Math.floor(Math.random()*1000)} ~\n[#PowerCutLK #SriLanka #lka #ceb]`,
                    media_ids: mediaIDs.slice(0, 4)
                }, (err, data) => { 
                    if (err) throw Error(err);
                    
                    if (ImageIds.length > 4) {
                        client.post('statuses/update',
                        {
                            status: "",
                            in_reply_to_status_id: data.id_str,
                            media_ids: mediaIDs.slice(4, 8)
                        }, (err) => {  if (err) throw Error(err) }) 
                    };
                });
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