"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowManager = void 0;
const helpers_1 = require("../../helpers");
const flow_1 = require("../flow");
class FlowManager {
    constructor(screens, anotherObjects) {
        this.checkFlowExists = (name, throwException = true) => {
            const exists = this.flows.hasOwnProperty(name);
            if (!exists && throwException) {
                throw new Error(`The flow name "${name}" doesn't exists.`);
            }
            return exists;
        };
        this.log = (msg, ...rest) => {
            helpers_1.LoggerHelper.log('Flow')(msg, rest);
        };
        this.flow = (input) => {
            const { name, baseUrl } = input;
            if (!this.flows.hasOwnProperty(name)) {
                this.flows[name] = new flow_1.Flow(name, baseUrl);
            }
            return {
                steps: this.steps(input),
            };
        };
        this.getFlow = (name) => {
            return this.flows[name];
        };
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        this.steps = ({ name: flowName, baseUrl }) => (steps) => {
            this.checkFlowExists(flowName);
            const flow = this.getFlow(flowName);
            Object.keys(steps).forEach(step => {
                const screen = this.screens[step];
                this.log('steps', {
                    screens: this.screens,
                    screen,
                    step,
                });
                flow.addStep(screen, step, steps[step]);
            });
            this.log('flow', { flow });
            return {
                step: (name) => {
                    const screen = this.screens[name];
                    return (screenActions) => {
                        Object.keys(screenActions).forEach(action => {
                            const gotoScreen = screenActions[action];
                            this.log('step', {
                                screens: this.screens,
                                steps,
                                name,
                                gotoScreen,
                                screenActions,
                            });
                            flow.addAction(name, action, gotoScreen);
                        });
                        this.log('flow final', {
                            flow,
                        });
                    };
                },
                anotherObject: (name) => {
                    const anotherObject = this.anotherObjects[name];
                    return (actions) => {
                        Object.keys(actions).forEach(action => {
                            const gotoScreen = actions[action];
                            this.log('anotherObject', {
                                screens: this.screens,
                                steps,
                                name,
                                gotoScreen,
                                actions,
                            });
                            flow.addAction(name, action, gotoScreen, true);
                        });
                        this.log('flow final', {
                            flow,
                        });
                    };
                },
                // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                listen: (input) => {
                    if (typeof input === 'function') {
                        const params = input;
                        return flow.addListener(params, 'all');
                    }
                    else {
                        const params = input;
                        return flow.addListener(params.callback, params.type);
                    }
                },
                start: (stepName, options) => {
                    return {
                        flowName,
                        stepName: stepName,
                        options,
                    };
                },
                navigateTo: (stepName, options
                // eslint-disable-next-line sonarjs/no-identical-functions
                ) => {
                    return {
                        flowName,
                        stepName: stepName,
                        options,
                    };
                },
                name: () => flowName,
            };
        };
        /**
         * Allow clear history for all flows when not passed specific flow (flowName param) or clear only for specific flow
         *
         * @param flowName	flow name of flow to clear history
         */
        this.clearAllHistory = (flowName) => {
            if (flowName) {
                const flow = this.getFlow(flowName);
                this.log('clearAllHistory', {
                    flow,
                    flowName,
                });
                flow === null || flow === void 0 ? void 0 : flow.clearHistory();
            }
            else {
                Object.keys(this.flows).forEach(flow => {
                    this.log('clearAllHistory', {
                        flow,
                    });
                    this.getFlow(flow).clearHistory();
                });
            }
        };
        if (!this._instance) {
            this.screens = screens;
            this.anotherObjects = anotherObjects;
            this.flows = {};
            this._instance = this;
        }
        return this._instance;
    }
}
exports.FlowManager = FlowManager;
