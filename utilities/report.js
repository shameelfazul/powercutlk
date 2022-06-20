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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.save = exports.check = void 0;
var jimp_1 = __importDefault(require("jimp"));
var node_downloader_helper_1 = require("node-downloader-helper");
var dist_1 = require("./custom/pdf2pic/dist");
var schema_1 = __importDefault(require("../db/schema"));
var ReportModel_1 = require("../models/ReportModel");
var fs_1 = require("fs");
function check(context) {
    return __awaiter(this, void 0, void 0, function () {
        var page, element, label, url, document;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, context.newPage()];
                case 1:
                    page = _a.sent();
                    return [4 /*yield*/, page.goto(process.env.SOURCEURL, { timeout: 60000 })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, page.locator(':nth-match(a:text("Power Interruption"), 2)')];
                case 3:
                    element = _a.sent();
                    return [4 /*yield*/, element.textContent()];
                case 4:
                    label = _a.sent();
                    return [4 /*yield*/, element.getAttribute("href")];
                case 5:
                    url = _a.sent();
                    return [4 /*yield*/, page.close()];
                case 6:
                    _a.sent();
                    if (label == null || url == null)
                        throw TypeError("label or url is referencing null");
                    return [4 /*yield*/, schema_1["default"].findOne({ label: label, url: url })];
                case 7:
                    document = _a.sent();
                    if (document == null)
                        return [2 /*return*/, new ReportModel_1.ReportModel(false, label, url)];
                    else
                        return [2 /*return*/, new ReportModel_1.ReportModel(true, "", "")];
                    return [2 /*return*/];
            }
        });
    });
}
exports.check = check;
function save(url) {
    return __awaiter(this, void 0, void 0, function () {
        var download, options, convert;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if ((0, fs_1.existsSync)('temp'))
                        (0, fs_1.rmSync)('temp', { recursive: true, force: true });
                    (0, fs_1.mkdirSync)('temp');
                    (0, fs_1.mkdirSync)('temp/report');
                    (0, fs_1.mkdirSync)('temp/output');
                    download = new node_downloader_helper_1.DownloaderHelper(url, 'temp');
                    return [4 /*yield*/, download.start()];
                case 1:
                    _a.sent();
                    options = {
                        density: 100,
                        saveFilename: "report",
                        savePath: "temp/report",
                        format: "png",
                        width: 1100,
                        height: 720
                    };
                    convert = (0, dist_1.fromPath)(download.getDownloadPath(), options);
                    return [4 /*yield*/, convert.bulk(-1)];
                case 2:
                    _a.sent();
                    (0, fs_1.readdirSync)("temp/report").forEach(function (name) { return __awaiter(_this, void 0, void 0, function () {
                        var image, _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, jimp_1["default"].read("temp/report/".concat(name))];
                                case 1:
                                    image = _c.sent();
                                    _b = (_a = image).print;
                                    return [4 /*yield*/, jimp_1["default"].loadFont(jimp_1["default"].FONT_SANS_16_BLACK)];
                                case 2:
                                    _b.apply(_a, [_c.sent(), image.bitmap.width * 0.80, image.bitmap.height * 0.95, "Twitter - @PowerCut_LK"]);
                                    image.write("temp/output/".concat(name.slice(0, 8), "-output.png"));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
exports.save = save;
