"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const sessionSchema = new mongoose_1.default.Schema({
    totalLength: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: false,
    },
    userID: {
        type: String,
        required: true
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    individualSubjects: [{
            name: String,
            length: Number
        }]
});
sessionSchema.plugin(mongoose_unique_validator_1.default);
const Session = mongoose_1.default.model('Session', sessionSchema);
exports.default = Session;
