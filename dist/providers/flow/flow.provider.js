"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowProvider = exports.flowManagerContext = void 0;
const react_1 = __importDefault(require("react"));
const hooks_1 = require("../../hooks");
const types_1 = require("../../types");
exports.flowManagerContext = react_1.default.createContext({
    fm: undefined,
    currentFlowName: '',
    options: {
        animation: false,
        withUrl: false,
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    start: (flowName, stepName, options) => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    back: () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dispatch: (screen, name, payload) => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    refresh: () => { },
});
const FlowProvider = ({ fm, initialFlowName, children, initialStepName, options, onFlowMount, onFlowUnmount, listen, }) => {
    var _a;
    const [_, setForceUpdate] = react_1.default.useState(0);
    const currentFlowName = react_1.default.useRef(initialFlowName);
    const flow = react_1.default.useRef(fm.getFlow(currentFlowName.current));
    const logger = (0, hooks_1.useLoggerFlow)();
    const initialized = react_1.default.useRef(false);
    const { animation = types_1.DEFAULT_FLOW_MANAGER_OPTIONS.animation, withUrl = types_1.DEFAULT_FLOW_MANAGER_OPTIONS.withUrl } = options || types_1.DEFAULT_FLOW_MANAGER_OPTIONS;
    const parsedOptions = {
        animation,
        withUrl,
    };
    const lastFlowName = react_1.default.useRef();
    const forceUpdate = react_1.default.useCallback(() => {
        flow.current = fm.getFlow(currentFlowName.current);
        setForceUpdate(val => val + 1);
    }, [fm]);
    const updateLocationUrl = react_1.default.useCallback((url) => {
        if (!withUrl) {
            return;
        }
        logger.log('FlowProvider > updateLocationUrl', { url: `#${url}` });
        url && window.history.replaceState(null, null, `#${url}`);
    }, [logger, withUrl]);
    const handleStart = react_1.default.useCallback((flowName, stepName, options, fromFlowName, ignoreFromFlow = false, isFromBack = false) => {
        logger.log('FlowProvider > handleStart', { flowName });
        const flow = fm.getFlow(flowName);
        // assumed value passed or current flow name when not set to ignore
        fromFlowName = fromFlowName ? fromFlowName : ignoreFromFlow ? undefined : currentFlowName.current;
        const { changed, historyUrl, currentFlowName: actionFlowName } = (flow === null || flow === void 0 ? void 0 : flow.start(stepName, fromFlowName, options, isFromBack)) || {};
        if (changed) {
            // when action flow name is different current flow name, call start again to another flow
            if (actionFlowName && actionFlowName !== flowName) {
                const { fromFlowName } = fm.getFlow(actionFlowName);
                return handleStart(actionFlowName, undefined, undefined, fromFlowName, true, isFromBack);
            }
            currentFlowName.current = flowName;
            updateLocationUrl(historyUrl);
            forceUpdate();
        }
    }, [fm, forceUpdate, logger, updateLocationUrl]);
    const handleBack = react_1.default.useCallback(() => {
        var _a;
        const { changed, currentFlowName: actionFlowName, currentStepName, historyUrl } = ((_a = flow.current) === null || _a === void 0 ? void 0 : _a.back()) || {};
        logger.log('FlowProvider > back', { changed, currentFlowName });
        if (changed) {
            listen === null || listen === void 0 ? void 0 : listen({ currentStepName: '', flowName: currentFlowName.current, type: 'back', url: historyUrl });
        }
        if (changed && actionFlowName !== currentFlowName.current) {
            const { fromFlowName } = fm.getFlow(actionFlowName);
            handleStart(actionFlowName, currentStepName, undefined, fromFlowName, true, true);
        }
        else if (changed) {
            updateLocationUrl(historyUrl);
            forceUpdate();
        }
    }, [fm, forceUpdate, handleStart, listen, logger, updateLocationUrl]);
    const handleDispatch = react_1.default.useCallback((screen, name, payload) => {
        var _a;
        const { changed, currentFlowName: actionFlowName, currentStepName, historyUrl, clearHistory, ignoreHistory, } = ((_a = flow.current) === null || _a === void 0 ? void 0 : _a.dispatch(screen, name, payload)) || {};
        logger.log('FlowProvider > dispatch', { name, payload, changed });
        if (changed) {
            listen === null || listen === void 0 ? void 0 : listen({
                currentStepName: '',
                flowName: actionFlowName || currentFlowName.current,
                type: 'dispatch',
                url: historyUrl,
                dispatch: {
                    actionName: name,
                    payload,
                },
                options: {
                    clearHistory,
                    ignoreHistory,
                },
            });
        }
        if (actionFlowName && actionFlowName !== currentFlowName.current) {
            // when clear history get fromFlowName of goto flow to keep history correct
            // because clear history allow to forget passed from current flow
            if (clearHistory) {
                const { fromFlowName } = fm.getFlow(actionFlowName);
                return handleStart(actionFlowName, currentStepName, undefined, fromFlowName);
            }
            else {
                return handleStart(actionFlowName, currentStepName);
            }
        }
        else {
            changed && forceUpdate();
        }
        updateLocationUrl(historyUrl);
    }, [fm, forceUpdate, handleStart, listen, logger, updateLocationUrl]);
    const handleRefresh = react_1.default.useCallback(() => {
        forceUpdate();
    }, [forceUpdate]);
    if (!initialized.current) {
        initialized.current = true;
        handleStart(currentFlowName.current, initialStepName);
    }
    const flowManagerContextValue = react_1.default.useMemo(() => {
        var _a;
        return ({
            fm,
            currentFlowName: (_a = flow.current) === null || _a === void 0 ? void 0 : _a.name,
            start: handleStart,
            back: handleBack,
            dispatch: handleDispatch,
            refresh: handleRefresh,
            options: parsedOptions,
        });
    }, [fm, handleBack, handleDispatch, handleRefresh, handleStart, parsedOptions]);
    react_1.default.useEffect(() => {
        // call unmount handler for last flow
        if (lastFlowName.current && lastFlowName.current !== currentFlowName.current && onFlowUnmount) {
            const handler = onFlowUnmount[lastFlowName.current];
            handler === null || handler === void 0 ? void 0 : handler();
        }
        // call mount handler for current flow
        if ((!lastFlowName.current || lastFlowName.current !== currentFlowName.current) && onFlowMount) {
            lastFlowName.current = currentFlowName.current;
            const handler = onFlowMount[currentFlowName.current];
            handler === null || handler === void 0 ? void 0 : handler();
        }
    }, [_, fm, onFlowMount, onFlowUnmount]);
    logger.log('FlowProvider', {
        flow: flow.current,
        currentFlowName: currentFlowName.current,
        lastFlowName: lastFlowName.current,
    });
    return (react_1.default.createElement(exports.flowManagerContext.Provider, { value: flowManagerContextValue }, children ? children : (_a = flow.current) === null || _a === void 0 ? void 0 : _a.render(parsedOptions)));
};
exports.FlowProvider = FlowProvider;
