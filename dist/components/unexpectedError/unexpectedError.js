"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnexpectedError = void 0;
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../hooks");
const UnexpectedError = ({ error }) => {
    const logger = (0, hooks_1.useLoggerFlow)();
    react_1.default.useEffect(() => {
        logger.error('UnexpectedError', { error });
    }, []);
    return react_1.default.createElement("h1", null, "Pedimos desculpa, mas de momento n\u00E3o podemos satisfazer o seu pedido!");
};
exports.UnexpectedError = UnexpectedError;
