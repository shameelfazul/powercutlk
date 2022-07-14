"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.message = void 0;
const fs_1 = require("fs");
const schema_1 = __importDefault(require("../db/schema"));
function message(twitterClient, discordWebhook, report) {
    return __awaiter(this, void 0, void 0, function* () {
        yield tweet(twitterClient, report);
        yield discord(discordWebhook, report);
        yield schema_1.default.create({ label: report.label, url: report.url });
        setTimeout(() => process.exit(0), 10000);
    });
}
exports.message = message;
function tweet(client, report) {
    return __awaiter(this, void 0, void 0, function* () {
        let ImageIds = [];
        (0, fs_1.readdirSync)("temp/output").forEach((name) => __awaiter(this, void 0, void 0, function* () {
            let image = (0, fs_1.readFileSync)(`temp/output/${name}`, { encoding: 'base64' });
            let count = (0, fs_1.readdirSync)("temp/output").length;
            client.post('media/upload', { media_data: image }, (err, data) => {
                if (err)
                    throw Error(err);
                ImageIds.push({ Id: data.media_id_string, Index: Number(name.slice(7, 8)) });
                if (ImageIds.length == count) {
                    let mediaIDs = ImageIds.sort((a, b) => a.Index - b.Index).map(x => x.Id);
                    client.post('statuses/update', {
                        status: `${report.label} ${ImageIds.length > 4 ? `\n\n--- ⬇️ More Schedules Down ⬇️ ---` : ''}\n\n    ~ 🇱🇰  STATUS ID ${Math.floor(Math.random() * 1000)} ~\n[#PowerCutLK #SriLanka #lka #ceb]`,
                        media_ids: mediaIDs.slice(0, 4)
                    }, (err, data) => {
                        if (err)
                            throw Error(err);
                        if (ImageIds.length > 4) {
                            client.post('statuses/update', {
                                status: "",
                                in_reply_to_status_id: data.id_str,
                                media_ids: mediaIDs.slice(4, 8)
                            }, (err) => { if (err)
                                throw Error(err); });
                        }
                        ;
                    });
                }
                ;
            });
        }));
    });
}
;
function discord(webhook, report) {
    return __awaiter(this, void 0, void 0, function* () {
        webhook.setUsername('PowerCut_LK');
        webhook.setAvatar('https://pbs.twimg.com/profile_images/1536671063983128577/qwofMeAi_400x400.jpg');
        yield webhook.send(report.label);
        (0, fs_1.readdirSync)("temp/output").forEach((name) => __awaiter(this, void 0, void 0, function* () {
            yield webhook.sendFile(`temp/output/${name}`);
        }));
    });
}
;
