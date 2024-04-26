"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepRender = void 0;
const react_1 = __importDefault(require("react"));
const providers_1 = require("../../providers");
const StepRender = () => {
    const { currentFlowName, fm, options } = react_1.default.useContext(providers_1.flowManagerContext);
    const flow = fm.getFlow(currentFlowName);
    return react_1.default.createElement(react_1.default.Fragment, null, flow === null || flow === void 0 ? void 0 : flow.render(options));
};
exports.StepRender = StepRender;
