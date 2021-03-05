"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    instrument: {
        type: String,
        required: false,
    },
    mySubjects: [
        {
            subjectID: {
                type: String,
                required: true,
            },
            subjectName: {
                type: String,
                required: true,
            },
            timePracticed: Number,
            subjectNotes: [
                {
                    date: String,
                    notes: String,
                },
            ],
        },
    ],
    joined: {
        type: String,
        required: true,
    },
    sessions: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Session',
        },
    ],
    connections: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});
userSchema.plugin(mongoose_unique_validator_1.default);
// const User = mongoose.model('User', userSchema);
exports.default = mongoose_1.model('User', userSchema);
