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
const playwright_chromium_1 = require("playwright-chromium");
const fs_1 = require("fs");
// @ts-ignore
const twit_1 = __importDefault(require("twit"));
const mongoose_1 = __importDefault(require("mongoose"));
const report_1 = require("./utilities/report");
// @ts-ignore
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const discord_webhook_node_1 = require("discord-webhook-node");
const message_1 = require("./utilities/message");
const device = playwright_chromium_1.devices["Desktop Chrome"];
const hook = new discord_webhook_node_1.Webhook(process.env.DISCORD);
const T = new twit_1.default({ consumer_key: process.env.CONSUMER_KEY, consumer_secret: process.env.CONSUMER_SECRET, access_token: process.env.ACCESS_TOKEN, access_token_secret: process.env.ACCESS_TOKEN_SECRET });
console.log(`[PowerCutLK] : Service Started`);
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`[PowerCutLK] : ${moment_timezone_1.default.utc((new Date).getTime()).tz('Asia/Colombo').format('LLLL')}`);
            yield mongoose_1.default.connect(process.env.DATABASE);
            const browser = yield playwright_chromium_1.chromium.launch({ chromiumSandbox: false });
            const context = yield browser.newContext(Object.assign({ acceptDownloads: true }, device));
            let report = yield (0, report_1.check)(context);
            yield browser.close();
            if (report.status == false) {
                yield (0, report_1.save)(report.url);
                queue(report);
            }
            else
                console.log("[PowerCutLK] : Report is up-to-date");
        }
        catch (error) {
            console.error(error);
        }
        function queue(report) {
            setTimeout(() => {
                (0, fs_1.readFile)(`temp/output/report.${(0, fs_1.readdirSync)('temp/report').length}-output.png`, (err, data) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log(`[PowerCutLK] : Queueing : ${(0, fs_1.readdirSync)('temp/output').length}/${(0, fs_1.readdirSync)('temp/report').length}`);
                        queue(report);
                    }
                    else {
                        yield (0, message_1.message)(T, hook, report);
                    }
                }));
            }, 1000);
        }
    });
}
