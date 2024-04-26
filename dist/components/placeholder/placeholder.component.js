"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Placeholder = void 0;
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../hooks");
require("./placeholder.styles.css");
//@ts-ignore
const Placeholder = ({ children, loading }) => {
    const { log } = (0, hooks_1.useLogger)('components');
    log('Placeholder > render', { loading });
    return (react_1.default.createElement(react_1.default.Fragment, null,
        loading && (react_1.default.createElement("div", { className: "placeholder-load-wraper" },
            react_1.default.createElement("div", { className: "placeholder-activity" }))),
        !loading && react_1.default.createElement(react_1.default.Fragment, null, children)));
};
exports.Placeholder = Placeholder;
