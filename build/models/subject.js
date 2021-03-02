"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const subjectSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false,
    },
    timePracticed: {
        type: Number,
        required: true
    }
});
subjectSchema.plugin(mongoose_unique_validator_1.default);
const Subject = mongoose_1.default.model('Subject', subjectSchema);
exports.default = Subject;
