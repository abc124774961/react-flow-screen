import { TFlowManagerStartMethodInput, TScreen } from '../../types';
export declare const useFlow: <TScreenInner extends TScreen>(screen?: TScreenInner) => {
    back: () => void;
    clearHistory: () => void;
    dispatch: (name: TScreenInner['actions'][number], payload?: Record<string, any>) => void;
    getCurrentStep: () => import("../../models/step").Step;
    getHistory: () => string[];
    getLastAction: () => import("../../types").TFlowLastAction;
    getPreviousStep: () => import("../../models/step").Step;
    hasPreviousStep: () => boolean;
    refresh: () => void;
};
export declare const useFlowManager: () => {
    currentFlowName: string;
    start: ({ flowName, stepName, options }: TFlowManagerStartMethodInput) => void;
    clearAllHistory: (flowName?: string) => void;
};
