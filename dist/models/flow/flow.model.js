"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.Flow = void 0;
const react_1 = __importDefault(require("react"));
const components_1 = require("../../components");
const helpers_1 = require("../../helpers");
const step_1 = require("../step");
class Flow {
    constructor(name, baseUrl) {
        this.logger = (message, ...args) => {
            helpers_1.LoggerHelper.log('Flow')(message, args);
        };
        this.callListeners = (type, dispatch, options) => {
            const currentStepName = type === 'mount' ? this.currentStepName : this.lastRenderStepName || this.currentStepName;
            const currentStep = this.steps[currentStepName];
            const data = {
                url: this.buildUrl(currentStep),
                flowName: this.name,
                currentStepName,
                type,
                dispatch,
                options,
            };
            this.listeners[type].forEach(fn => fn(data));
            this.listeners['all'].forEach(fn => fn(data));
        };
        this.hasPreviousStep = () => {
            return this.history.length > 0 || this.fromFlowName ? true : false;
        };
        this.getPreviousStep = () => {
            return this.history.length > 0 ? this.steps[this.history[this.history.length - 1]] : undefined;
        };
        this.getCurrentStep = () => {
            return this.steps[this.currentStepName];
        };
        this.getHistory = () => {
            return this.history;
        };
        this.getLastAction = () => {
            return this.lastAction;
        };
        this.addStep = (screen, name, options) => {
            const step = new step_1.Step(name, screen.loader, options);
            if (!this.initialStepName && helpers_1.CoreHelper.getValueOrDefault(options.initialStep, false)) {
                this.initialStepName = step.name;
            }
            this.steps[name] = step;
        };
        this.addAction = (screenName, actionName, gotoScreenName, isAnotherObject = false) => {
            if (isAnotherObject) {
                this.anotherObjects = this.anotherObjects || {};
                this.anotherObjects[screenName] = this.anotherObjects[screenName] || {
                    actions: {},
                    loader: () => react_1.default.lazy(() => Promise.resolve().then(() => __importStar(require('./emptyComponent')))),
                    name: screenName,
                };
                this.anotherObjects[screenName].actions[actionName] = gotoScreenName;
            }
            else {
                const step = this.steps[screenName];
                step.actions[actionName] = gotoScreenName;
            }
        };
        this.addListener = (callback, type = 'all') => {
            this.listeners[type].push(callback);
        };
        this.stepUrl = (step) => {
            var _a;
            return ((_a = step === null || step === void 0 ? void 0 : step.options) === null || _a === void 0 ? void 0 : _a.url) || step.name;
        };
        this.buildUrl = (currentStep) => {
            let baseUrl = this.baseUrl;
            currentStep = currentStep || this.getCurrentStep();
            const currentStepUrl = currentStep ? this.stepUrl(currentStep) : '';
            baseUrl = baseUrl.startsWith('/') ? baseUrl.substring(1, baseUrl.length) : baseUrl;
            baseUrl = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
            return `/${baseUrl}/${currentStepUrl}`;
        };
        this.render = (options) => {
            const currentStepName = this.currentStepName;
            const { animation } = options;
            this.logger('Flow > render [start]', { currentStepName });
            if (!currentStepName) {
                this.lastRenderStepName = currentStepName;
                return null;
            }
            // check if lastRenderStepName is undefined to dispatch first mount
            if (!this.lastRenderStepName || this.lastRenderStepName !== this.currentStepName) {
                this.mount();
            }
            this.lastRenderStepName = currentStepName;
            if (currentStepName && this.steps.hasOwnProperty(currentStepName)) {
                const step = this.steps[currentStepName];
                const { clearHistory = false } = step.options || {};
                if (clearHistory) {
                    this.clearHistory();
                }
                const Screen = step.loader();
                this.logger('Flow > render [start]', { currentStepName, Screen });
                const fallback = animation === false ? react_1.default.createElement(react_1.default.Fragment, null) : animation === true ? react_1.default.createElement(components_1.Placeholder, { loading: true }) : animation;
                return (react_1.default.createElement(react_1.default.Suspense, { fallback: fallback },
                    react_1.default.createElement(Screen, null)));
            }
            return null;
        };
        this.start = (stepName, fromFlowName, options, isFromBack = false) => {
            var _a;
            this.logger('start', { stepName, fromFlowName, options });
            this.lastAction = undefined;
            this.fromFlowName = this.name !== fromFlowName ? fromFlowName : undefined;
            const currentStepName = stepName || this.currentStepName || this.initialStepName || this.firstStepName;
            const { clearHistory = false } = options || {};
            // check if is back
            if (isFromBack) {
                this.lastAction = 'back';
                // clear last render step name to call mount listener
                this.lastRenderStepName = undefined;
                // when not has history and exists from flow name navigate to
                if (this.fromFlowName && this.history.length === 0) {
                    return {
                        changed: true,
                        currentFlowName: this.fromFlowName,
                    };
                }
            }
            if (this.steps.hasOwnProperty(currentStepName)) {
                this.currentStepName = currentStepName;
                if (clearHistory || this.getCurrentStep().options.clearHistory) {
                    this.clearHistory();
                }
                if (currentStepName === ((_a = this.getPreviousStep()) === null || _a === void 0 ? void 0 : _a.name)) {
                    this.removeLastStepHistory();
                }
                return {
                    changed: true,
                    historyUrl: this.buildUrl(),
                    currentFlowName: this.name,
                    currentStepName: this.currentStepName,
                };
            }
            return { changed: false };
        };
        this.mount = () => {
            this.callListeners('mount');
        };
        this.back = () => {
            let backStepName = this.history.pop();
            // when backStepName is equal to currentStepName, try get another back step, to working properly because outside navigation
            // ex: when last screen not doing anything and keep in the same screen. If the user click in back, it's necessary navigate to before step
            if (backStepName === this.currentStepName) {
                backStepName = this.history.pop();
            }
            if (backStepName) {
                this.lastAction = 'back';
                this.currentStepName = backStepName;
                this.callListeners('back');
                return {
                    changed: true,
                    currentFlowName: this.name,
                    currentStepName: this.currentStepName,
                    historyUrl: this.buildUrl(),
                };
            }
            else if (this.fromFlowName) {
                this.callListeners('backExit');
                return { changed: true, currentFlowName: this.fromFlowName };
            }
            return { changed: false };
        };
        this.removeLastStepHistory = () => {
            if (this.history.length > 0) {
                this.history.pop();
            }
        };
        this.clearHistory = () => {
            this.history = [];
            this.fromFlowName = undefined;
        };
        // eslint-disable-next-line sonarjs/cognitive-complexity
        this.treatHistory = (nextStepName) => {
            var _a, _b, _c, _d, _e;
            if (this.currentStepName) {
                const currentStep = this.steps[this.currentStepName];
                this.logger('Flow > treatHistory', {
                    currentStep,
                    ignoreHistory: (_a = currentStep.options) === null || _a === void 0 ? void 0 : _a.ignoreHistory,
                });
                // when clear history it's necessary empty history and from flow name when back not doing anything
                if (helpers_1.CoreHelper.getValueOrDefault((_b = currentStep.options) === null || _b === void 0 ? void 0 : _b.clearHistory, false)) {
                    this.clearHistory();
                }
                if (!helpers_1.CoreHelper.getValueOrDefault((_c = currentStep.options) === null || _c === void 0 ? void 0 : _c.ignoreHistory, false)) {
                    this.history.push(this.currentStepName);
                }
                // check allow cyclic for current step
                if (!helpers_1.CoreHelper.getValueOrDefault((_d = currentStep.options) === null || _d === void 0 ? void 0 : _d.allowCyclicHistory, false)) {
                    const numberOfStepOccurrences = this.history.filter(x => x === this.currentStepName).length;
                    if (numberOfStepOccurrences > 0) {
                        const firstStepOccurrenceIndex = this.history.findIndex(x => x === this.currentStepName);
                        if (firstStepOccurrenceIndex >= 0) {
                            this.history = this.history.splice(0, firstStepOccurrenceIndex + 1);
                        }
                    }
                }
                // check allow cyclic for next step
                const nextStep = this.steps[nextStepName];
                if (nextStep && !helpers_1.CoreHelper.getValueOrDefault((_e = nextStep.options) === null || _e === void 0 ? void 0 : _e.allowCyclicHistory, false)) {
                    const numberOfStepOccurrences = this.history.filter(x => x === nextStepName).length;
                    if (numberOfStepOccurrences > 0) {
                        const firstStepOccurrenceIndex = this.history.findIndex(x => x === nextStepName);
                        if (firstStepOccurrenceIndex >= 0) {
                            this.history = this.history.splice(0, firstStepOccurrenceIndex + 1);
                        }
                    }
                }
            }
        };
        // eslint-disable-next-line sonarjs/cognitive-complexity
        this.dispatch = (screen, actionName, payload) => {
            var _a, _b, _c;
            this.logger('Flow > dispatch [start]', {
                actionName,
                payload,
                flow: this,
            });
            let currentStep = this.currentStepName ? this.steps[this.currentStepName] : undefined;
            let nextStepNameOrFn = undefined;
            let changed = false;
            let nextStepFnResult = {
                flowName: undefined,
                stepName: undefined,
            };
            const currentStepOptions = helpers_1.CoreHelper.getValueOrDefault(currentStep.options, {});
            // check if used action based on current step or based on passed screen or passed another object, based on follow priorities
            // 1. action from current step
            // 2. action from passed screen/step
            // 2. action from passed another object
            const existsActionInCurrentStep = currentStep === null || currentStep === void 0 ? void 0 : currentStep.actions.hasOwnProperty(actionName);
            const existsActionInPassedScreen = screen.actions.includes(actionName) && this.steps.hasOwnProperty(screen.name);
            const existsActionInPassedAnotherObjects = screen.actions.includes(actionName) && ((_a = this.anotherObjects) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(screen.name));
            if (!existsActionInCurrentStep && existsActionInPassedScreen) {
                currentStep = this.steps[screen.name];
            }
            else if (!existsActionInCurrentStep && !existsActionInPassedScreen && existsActionInPassedAnotherObjects) {
                currentStep = this.anotherObjects[screen.name];
            }
            if (existsActionInCurrentStep || existsActionInPassedScreen || existsActionInPassedAnotherObjects) {
                nextStepNameOrFn = currentStep.actions[actionName];
                if (typeof nextStepNameOrFn === 'string') {
                    changed = this.currentStepName !== nextStepNameOrFn;
                    if (changed) {
                        this.treatHistory(nextStepNameOrFn);
                    }
                    this.currentStepName = nextStepNameOrFn;
                }
                else {
                    nextStepFnResult = nextStepNameOrFn() || {};
                    this.treatHistory(nextStepFnResult.stepName);
                    if ((_b = nextStepFnResult === null || nextStepFnResult === void 0 ? void 0 : nextStepFnResult.options) === null || _b === void 0 ? void 0 : _b.clearHistory) {
                        this.clearHistory();
                    }
                    if (nextStepFnResult.stepName) {
                        this.currentStepName = nextStepFnResult.stepName;
                    }
                    else {
                        // set to current step to update lastThreeSteps
                        // eslint-disable-next-line no-self-assign
                        this.currentStepName = this.currentStepName;
                    }
                    changed = true;
                }
            }
            const clearHistory = ((_c = nextStepFnResult.options) === null || _c === void 0 ? void 0 : _c.clearHistory) || currentStepOptions.clearHistory || false;
            const ignoreHistory = currentStepOptions.ignoreHistory || false;
            if (changed) {
                this.lastAction = 'dispatch';
                this.callListeners('dispatch', { actionName, payload }, {
                    clearHistory,
                    ignoreHistory,
                });
            }
            this.logger('Flow > dispatch [end]', {
                nextStepNameOrFn,
                changed,
                flow: this,
            });
            return {
                currentFlowName: nextStepFnResult.flowName,
                currentStepName: nextStepFnResult.stepName,
                changed,
                historyUrl: this.buildUrl(),
                clearHistory,
                ignoreHistory,
            };
        };
        this.name = name;
        this.baseUrl = baseUrl;
        this.steps = {};
        this.last2Steps = {};
        this.history = [];
        this.listeners = {
            all: [],
            back: [],
            backExit: [],
            dispatch: [],
            mount: [],
        };
    }
    get stepsArray() {
        return Object.keys(this.steps);
    }
    get firstStepName() {
        const stepsArray = this.stepsArray;
        return stepsArray.length > 0 ? stepsArray[0] : undefined;
    }
    get lastStepName() {
        return this.last2Steps[1];
    }
    get currentStepName() {
        return this.last2Steps[0];
    }
    set currentStepName(value) {
        if (this.steps.hasOwnProperty(value) && this.last2Steps[0] !== value) {
            this.last2Steps[1] = this.last2Steps[0];
            this.last2Steps[0] = value;
        }
    }
}
exports.Flow = Flow;
