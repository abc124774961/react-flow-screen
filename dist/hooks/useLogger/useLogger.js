"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLoggerFlow = exports.useLogger = void 0;
const react_1 = __importDefault(require("react"));
const helpers_1 = require("../../helpers");
const useLogger = (group) => {
    return react_1.default.useCallback(() => ({
        error: helpers_1.LoggerHelper.error(group),
        log: helpers_1.LoggerHelper.log(group),
        warn: helpers_1.LoggerHelper.error(group),
    }), [group])();
};
exports.useLogger = useLogger;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useLoggerFlow = () => (0, exports.useLogger)('Flow');
exports.useLoggerFlow = useLoggerFlow;
