import { BrowserContext, Locator } from "playwright-chromium";
// @ts-ignore
import Jimp from "jimp";
import { DownloaderHelper } from 'node-downloader-helper';
import { fromPath } from "pdf2pic";
import database from "../db/schema";
import { ReportModel } from "../models/ReportModel";
import { rmSync, mkdirSync, existsSync, readdirSync, unlinkSync } from "fs";

export async function check(context : BrowserContext): Promise<ReportModel> {
    let page = await context.newPage();
    await page.goto(process.env.SOURCEURL as string, { timeout: 5 * 60000 });

    const element : Locator = await page.locator(':nth-match(a:text("Power Interruption"), 2)');

    const label : string | null  = await element.textContent();
    const url : string | null = await element.getAttribute("href");

    await page.close();

    if (label  == null || url == null) throw TypeError("label or url is referencing null");

    const document = await database.findOne({ label, url });
   if (document == null) return new ReportModel(false, label, url); else return new ReportModel(true, "", "");
}

async function counter(path : string) : Promise<number> {
  const options = {
    density: 100,
    saveFilename: "count",
    savePath: "temp/counter",
    format: "jpeg",
    width: 852,
    height: 480
  };
  const convert = fromPath(path, options);
  await convert.bulk(-1);

  return readdirSync("temp/counter").length;
}

export async function save(url : string) {
    if (existsSync('temp')) rmSync('temp', { recursive: true, force: true });
    mkdirSync('temp');
    mkdirSync('temp/report');
    mkdirSync('temp/counter');
    mkdirSync('temp/output');

    const download = new DownloaderHelper(url, 'temp');
    await download.start();

    const options = {
        density: 100,
        saveFilename: "report",
        savePath: "temp/report",
        format: "png",
        width: 1100,
        height: 720
      };

    const convert = fromPath(download.getDownloadPath(), options);
    await convert.bulk(await counter(download.getDownloadPath()) > 8 ? [1, 2, 3, 4, 5, 6, 7, 8] : -1);

    readdirSync("temp/report").forEach(async (name) => {
      let image = await Jimp.read(`temp/report/${name}`);
      image.print(await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK), image.bitmap.width * 0.80, image.bitmap.height * 0.95, "Twitter - @PowerCut_LK");

      image.write(`temp/output/${name.slice(0, 8)}-output.png`);
    });
}