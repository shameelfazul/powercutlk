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
exports.save = exports.check = void 0;
// @ts-ignore
const jimp_1 = __importDefault(require("jimp"));
const node_downloader_helper_1 = require("node-downloader-helper");
const pdf2pic_1 = require("pdf2pic");
const schema_1 = __importDefault(require("../db/schema"));
const ReportModel_1 = require("../models/ReportModel");
const fs_1 = require("fs");
function check(context) {
    return __awaiter(this, void 0, void 0, function* () {
        let page = yield context.newPage();
        yield page.goto(process.env.SOURCEURL, { timeout: 5 * 60000 });
        const element = yield page.locator(':nth-match(a:text("Power Interruption"), 2)');
        const label = yield element.textContent();
        const url = yield element.getAttribute("href");
        yield page.close();
        if (label == null || url == null)
            throw TypeError("label or url is referencing null");
        const document = yield schema_1.default.findOne({ label, url });
        if (document == null)
            return new ReportModel_1.ReportModel(false, label, url);
        else
            return new ReportModel_1.ReportModel(true, "", "");
    });
}
exports.check = check;
function counter(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            density: 100,
            saveFilename: "count",
            savePath: "temp/counter",
            format: "jpeg",
            width: 852,
            height: 480
        };
        const convert = (0, pdf2pic_1.fromPath)(path, options);
        yield convert.bulk(-1);
        return (0, fs_1.readdirSync)("temp/counter").length;
    });
}
function save(url) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, fs_1.existsSync)('temp'))
            (0, fs_1.rmSync)('temp', { recursive: true, force: true });
        (0, fs_1.mkdirSync)('temp');
        (0, fs_1.mkdirSync)('temp/report');
        (0, fs_1.mkdirSync)('temp/counter');
        (0, fs_1.mkdirSync)('temp/output');
        const download = new node_downloader_helper_1.DownloaderHelper(url, 'temp');
        yield download.start();
        const options = {
            density: 100,
            saveFilename: "report",
            savePath: "temp/report",
            format: "png",
            width: 1100,
            height: 720
        };
        const convert = (0, pdf2pic_1.fromPath)(download.getDownloadPath(), options);
        yield convert.bulk((yield counter(download.getDownloadPath())) > 8 ? [1, 2, 3, 4, 5, 6, 7, 8] : -1);
        (0, fs_1.readdirSync)("temp/report").forEach((name) => __awaiter(this, void 0, void 0, function* () {
            let image = yield jimp_1.default.read(`temp/report/${name}`);
            image.print(yield jimp_1.default.loadFont(jimp_1.default.FONT_SANS_16_BLACK), image.bitmap.width * 0.80, image.bitmap.height * 0.95, "Twitter - @PowerCut_LK");
            image.write(`temp/output/${name.slice(0, 8)}-output.png`);
        }));
    });
}
exports.save = save;
