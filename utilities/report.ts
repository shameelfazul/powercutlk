import { BrowserContext, Locator } from "playwright-chromium";
import Jimp from "jimp";
import { DownloaderHelper } from 'node-downloader-helper';
import { fromPath } from "pdf2pic";
import database from "../db/schema";
import { CheckModel } from "../models/check";
import { rmSync, mkdirSync, existsSync } from "fs";

export async function check(context : BrowserContext): Promise<CheckModel> {
    let page = await context.newPage();
    await page.goto(process.env.sourceUrl as string, { timeout: 60000 });

    const element : Locator = await page.locator(':nth-match(a:text("Power Interruption"), 2)');

    const label : string | null  = await element.textContent();
    const url : string | null = await element.getAttribute("href");

    await page.close();

    if (label  == null || url == null) throw TypeError("label or url is referencing null");

    const document = await database.findOne({ label, url });
   
   if (document == null) return new CheckModel(false, label, url); else return new CheckModel(true, "", "");
}

export async function save(url : string) {
    if (existsSync('temp')) rmSync('temp', { recursive: true, force: true });
    mkdirSync('temp');

    const download = new DownloaderHelper(url, 'temp');
    await download.start();

    const options = {
        density: 100,
        saveFilename: "report",
        savePath: "temp",
        format: "png",
        width: 1200,
        height: 675
      };

    const storeAsImage = fromPath(download.getDownloadPath(), options);
    await storeAsImage(1);

    let image = await Jimp.read('temp/report.1.png');
    image.print(await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK), image.bitmap.width * 0.35, image.bitmap.height * 0.84, "Twitter - @Powercut_LK")
    //image.print(await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK), image.bitmap.width * 0.45, image.bitmap.height * 0.89, "Shameel Fazul")
    
    await image.writeAsync(`temp/output.png`)
}