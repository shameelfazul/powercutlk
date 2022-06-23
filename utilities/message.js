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
exports.message = void 0;
var fs_1 = require("fs");
var schema_1 = __importDefault(require("../db/schema"));
function message(twitterClient, discordWebhook, report) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tweet(twitterClient, report)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, discord(discordWebhook, report)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, schema_1["default"].create({ label: report.label, url: report.url })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.message = message;
function tweet(client, report) {
    return __awaiter(this, void 0, void 0, function () {
        var ImageIds;
        var _this = this;
        return __generator(this, function (_a) {
            ImageIds = [];
            (0, fs_1.readdirSync)("temp/output").forEach(function (name) { return __awaiter(_this, void 0, void 0, function () {
                var image, count;
                return __generator(this, function (_a) {
                    image = (0, fs_1.readFileSync)("temp/output/".concat(name), { encoding: 'base64' });
                    count = (0, fs_1.readdirSync)("temp/output").length;
                    client.post('media/upload', { media_data: image }, function (err, data) {
                        if (err)
                            throw Error(err);
                        ImageIds.push({ Id: data.media_id_string, Index: Number(name.slice(7, 8)) });
                        if (ImageIds.length == count) {
                            var mediaIDs_1 = ImageIds.sort(function (a, b) { return a.Index - b.Index; }).map(function (x) { return x.Id; });
                            client.post('statuses/update', {
                                status: "".concat(report.label, "\n\n--- \u2B07\uFE0F More Schedules Down \u2B07\uFE0F ---\n\n    ~ \uD83C\uDDF1\uD83C\uDDF0  STATUS ID ").concat(Math.floor(Math.random() * 1000), " ~\n[#PowerCutLK #SriLanka #lka #ceb]"),
                                media_ids: mediaIDs_1.slice(0, 4)
                            }, function (err, data) {
                                if (err)
                                    throw Error(err);
                                if (ImageIds.length > 4) {
                                    client.post('statuses/update', {
                                        status: "",
                                        in_reply_to_status_id: data.id_str,
                                        media_ids: mediaIDs_1.slice(4, 8)
                                    }, function (err) { if (err)
                                        throw Error(err); });
                                }
                                ;
                            });
                        }
                        ;
                    });
                    return [2 /*return*/];
                });
            }); });
            return [2 /*return*/];
        });
    });
}
;
function discord(webhook, report) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    webhook.setUsername('PowerCut_LK');
                    webhook.setAvatar('https://pbs.twimg.com/profile_images/1536671063983128577/qwofMeAi_400x400.jpg');
                    return [4 /*yield*/, webhook.send(report.label)];
                case 1:
                    _a.sent();
                    (0, fs_1.readdirSync)("temp/output").forEach(function (name) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, webhook.sendFile("temp/output/".concat(name))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
;
