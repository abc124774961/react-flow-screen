import React from 'react';
import { FlowManager } from '../../models';
import { TFlowListenCallbackInput, TFlowManagerContext, TFlowManagerOptions } from '../../types';
export declare const flowManagerContext: React.Context<TFlowManagerContext>;
export type FlowProviderLifeCycleHandlers<TFlows> = Partial<Record<keyof TFlows, () => void>>;
type TDictionary = Record<string, any>;
interface FlowProviderProps<TFlows extends TDictionary> {
    fm: FlowManager<any, any, any, any>;
    initialFlowName: keyof TFlows;
    initialStepName?: string;
    options?: TFlowManagerOptions;
    /**
     * List of handlers by flows called when specific flow name is mounted
     */
    onFlowMount?: FlowProviderLifeCycleHandlers<Partial<TFlows>>;
    /**
     * List of handlers by flows called when specific flow name is unmounted
     */
    onFlowUnmount?: FlowProviderLifeCycleHandlers<Partial<TFlows>>;
    children?: React.ReactNode;
    listen?: (input: TFlowListenCallbackInput) => void;
}
export declare const FlowProvider: <TFlows extends TDictionary>({ fm, initialFlowName, children, initialStepName, options, onFlowMount, onFlowUnmount, listen, }: FlowProviderProps<TFlows>) => React.JSX.Element;
export {};
