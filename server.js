"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var dotenv_1 = __importDefault(require("dotenv"));
var playwright_chromium_1 = require("playwright-chromium");
var node_cron_1 = __importDefault(require("node-cron"));
var schema_1 = __importDefault(require("./db/schema"));
var fs_1 = require("fs");
var twit_1 = __importDefault(require("twit"));
var mongoose_1 = __importDefault(require("mongoose"));
var report_1 = require("./utilities/report");
var discord_webhook_node_1 = require("discord-webhook-node");
dotenv_1["default"].config();
var device = playwright_chromium_1.devices["Desktop Chrome"];
var hook = new discord_webhook_node_1.Webhook(process.env.DISCORD);
var T = new twit_1["default"]({ consumer_key: process.env.CONSUMER_KEY, consumer_secret: process.env.CONSUMER_SECRET, access_token: process.env.ACCESS_TOKEN, access_token_secret: process.env.ACCESS_TOKEN_SECRET });
node_cron_1["default"].schedule("* * */1 * *", function () { return main(); });
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, context, report_2, image, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    console.log("Checking...");
                    return [4 /*yield*/, mongoose_1["default"].connect(process.env.DATABASE)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, playwright_chromium_1.chromium.launch({ chromiumSandbox: false })];
                case 2:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newContext(__assign({ acceptDownloads: true }, device))];
                case 3:
                    context = _a.sent();
                    return [4 /*yield*/, (0, report_1.check)(context)];
                case 4:
                    report_2 = _a.sent();
                    return [4 /*yield*/, browser.close()];
                case 5:
                    _a.sent();
                    if (!(report_2.status == false)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, report_1.save)(report_2.url)];
                case 6:
                    _a.sent();
                    image = (0, fs_1.readFileSync)('temp/output.png', { encoding: 'base64' });
                    T.post('media/upload', { media_data: image }, function (err, data) {
                        if (err)
                            throw Error(err);
                        var text = "".concat(report_2.label);
                        var tweet = {
                            status: text + "\n\n    ~ \uD83C\uDDF1\uD83C\uDDF0  STATUS ID ".concat(Math.floor(Math.random() * 1000), " ~\n[#PowerCutLK #SriLanka #lka #ceb]"),
                            media_ids: [data.media_id_string]
                        };
                        T.post('statuses/update', tweet, function (err) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (err)
                                            throw Error(err);
                                        hook.setUsername('PowerCut_LK'); //Overrides the default webhook username
                                        hook.setAvatar('https://pbs.twimg.com/profile_images/1536671063983128577/qwofMeAi_400x400.jpg');
                                        return [4 /*yield*/, hook.sendFile('temp/output.png')];
                                    case 1:
                                        _a.sent();
                                        (0, fs_1.rmSync)('temp', { recursive: true, force: true });
                                        return [4 /*yield*/, schema_1["default"].create({ label: report_2.label, url: report_2.url })];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    });
                    _a.label = 7;
                case 7:
                    ;
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
