"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFlowManager = exports.useFlow = void 0;
const react_1 = __importDefault(require("react"));
const providers_1 = require("../../providers");
// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyFn = (ret) => {
    return ret;
};
const useFlow = (screen) => {
    const { back, dispatch, currentFlowName, fm, refresh } = react_1.default.useContext(providers_1.flowManagerContext);
    const flow = fm === null || fm === void 0 ? void 0 : fm.getFlow(currentFlowName);
    const handleDispatch = react_1.default.useCallback((name, payload) => {
        dispatch(screen, name, payload);
    }, [dispatch, screen]);
    const getCurrentStep = react_1.default.useCallback((flow === null || flow === void 0 ? void 0 : flow.getCurrentStep) || (() => emptyFn()), [flow]);
    const getHistory = react_1.default.useCallback((flow === null || flow === void 0 ? void 0 : flow.getHistory) || (() => emptyFn([])), [flow]);
    const getLastAction = react_1.default.useCallback((flow === null || flow === void 0 ? void 0 : flow.getLastAction) || (() => emptyFn()), [flow]);
    const getPreviousStep = react_1.default.useCallback((flow === null || flow === void 0 ? void 0 : flow.getPreviousStep) || (() => emptyFn()), [flow]);
    const hasPreviousStep = react_1.default.useCallback((flow === null || flow === void 0 ? void 0 : flow.hasPreviousStep) || (() => emptyFn(false)), [flow]);
    const clearHistory = react_1.default.useCallback((flow === null || flow === void 0 ? void 0 : flow.clearHistory) || (() => emptyFn()), [flow]);
    return react_1.default.useMemo(() => ({
        back: () => {
            back === null || back === void 0 ? void 0 : back();
        },
        clearHistory,
        dispatch: handleDispatch,
        getCurrentStep,
        getHistory,
        getLastAction,
        getPreviousStep,
        hasPreviousStep,
        refresh: () => {
            refresh === null || refresh === void 0 ? void 0 : refresh();
        },
    }), [
        back,
        clearHistory,
        getCurrentStep,
        getHistory,
        getLastAction,
        getPreviousStep,
        handleDispatch,
        hasPreviousStep,
        refresh,
    ]);
};
exports.useFlow = useFlow;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useFlowManager = () => {
    const { currentFlowName, start, fm } = react_1.default.useContext(providers_1.flowManagerContext);
    const handleStart = react_1.default.useCallback(({ flowName, stepName, options }) => {
        start(flowName, stepName, options);
    }, [start]);
    return react_1.default.useMemo(() => ({
        currentFlowName,
        start: handleStart,
        clearAllHistory: fm.clearAllHistory,
    }), [currentFlowName, fm.clearAllHistory, handleStart]);
};
exports.useFlowManager = useFlowManager;
