"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var mongoose_1 = __importDefault(require("mongoose"));
var PowercutSchema = new mongoose_1["default"].Schema({
    label: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});
exports["default"] = mongoose_1["default"].model('powercuts', PowercutSchema);
