import { TFlowActionOptions, TFlowCreatorInput, TFlowListen, TFlowListenCallback, TFlowManagerStartMethodOutput, TFlowScreenActionCallbackResult, TScreens, TStepOptions } from '../../types';
import { Flow } from '../flow';
export declare class FlowManager<TScreensInner extends TScreens, TFlowName extends string, TFlowStep extends keyof TScreensInner, TAnotherObjects extends Record<string, {
    actions: any;
}>> {
    private _instance;
    flows: Record<TFlowName, Flow>;
    screens: TScreensInner;
    anotherObjects: TAnotherObjects;
    constructor(screens: TScreensInner, anotherObjects?: TAnotherObjects);
    private checkFlowExists;
    private log;
    flow: (input: TFlowCreatorInput<TFlowName>) => {
        steps: <TStepName extends keyof TScreensInner>(steps: Partial<Record<TStepName, TStepOptions>>) => {
            step: <TCurrentStepName extends TStepName>(name: TCurrentStepName) => (screenActions: Record<TScreensInner[TCurrentStepName]["actions"][number], TStepName | (() => TFlowScreenActionCallbackResult | void)>) => void;
            anotherObject: <TCurrentStepName_1 extends keyof TAnotherObjects>(name: TCurrentStepName_1) => (actions: Record<TAnotherObjects[TCurrentStepName_1]["actions"][number], TStepName | (() => TFlowScreenActionCallbackResult | void)>) => void;
            listen: (input: TFlowListenCallback | {
                callback: TFlowListenCallback;
                type: TFlowListen;
            }) => void;
            start: <TStepName_1 extends TStepName>(stepName?: TStepName_1, options?: TFlowActionOptions) => TFlowManagerStartMethodOutput;
            navigateTo: <TStepName_2 extends TStepName>(stepName?: TStepName_2, options?: TFlowActionOptions) => TFlowScreenActionCallbackResult;
            name: () => TFlowName;
        };
    };
    getFlow: (name: string) => Flow | undefined;
    steps: ({ name: flowName, baseUrl }: TFlowCreatorInput<TFlowName>) => <TStepName extends keyof TScreensInner>(steps: Partial<Record<TStepName, TStepOptions>>) => {
        step: <TCurrentStepName extends TStepName>(name: TCurrentStepName) => (screenActions: Record<TScreensInner[TCurrentStepName]["actions"][number], TStepName | (() => TFlowScreenActionCallbackResult | void)>) => void;
        anotherObject: <TCurrentStepName_1 extends keyof TAnotherObjects>(name: TCurrentStepName_1) => (actions: Record<TAnotherObjects[TCurrentStepName_1]["actions"][number], TStepName | (() => TFlowScreenActionCallbackResult | void)>) => void;
        listen: (input: TFlowListenCallback | {
            callback: TFlowListenCallback;
            type: TFlowListen;
        }) => void;
        start: <TStepName_1 extends TStepName>(stepName?: TStepName_1, options?: TFlowActionOptions) => TFlowManagerStartMethodOutput;
        navigateTo: <TStepName_2 extends TStepName>(stepName?: TStepName_2, options?: TFlowActionOptions) => TFlowScreenActionCallbackResult;
        name: () => TFlowName;
    };
    /**
     * Allow clear history for all flows when not passed specific flow (flowName param) or clear only for specific flow
     *
     * @param flowName	flow name of flow to clear history
     */
    clearAllHistory: (flowName?: string) => void;
}
