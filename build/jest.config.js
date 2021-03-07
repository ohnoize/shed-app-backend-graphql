"use strict";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defaults: tsjPreset } = require('ts-jest/presets');
module.exports = {
    preset: '@shelf/jest-mongodb',
    modulePathIgnorePatterns: ['build'],
    transform: tsjPreset.transform,
};
