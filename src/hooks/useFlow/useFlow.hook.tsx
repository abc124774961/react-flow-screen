import React from 'react';
import { flowManagerContext } from '../../providers';
import { TFlowManagerStartMethodInput, TScreen } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyFn = <TOutput extends any>(ret?: TOutput): TOutput => {
	return ret;
};

export const useFlow = <TScreenInner extends TScreen>(screen?: TScreenInner) => {
	const { back, dispatch, currentFlowName, fm, refresh } = React.useContext(flowManagerContext);
	const flow = fm?.getFlow(currentFlowName);

	const handleDispatch = React.useCallback(
		(name: TScreenInner['actions'][number], payload?: Record<string, any>): void => {
			dispatch(screen, name, payload);
		},
		[dispatch, screen]
	);

	const getCurrentStep = React.useCallback(flow?.getCurrentStep || ((): undefined => emptyFn()), [flow]);

	const getHistory = React.useCallback(flow?.getHistory || ((): string[] => emptyFn([])), [flow]);

	const getLastAction = React.useCallback(flow?.getLastAction || ((): undefined => emptyFn()), [flow]);

	const getPreviousStep = React.useCallback(flow?.getPreviousStep || ((): undefined => emptyFn()), [flow]);

	const hasPreviousStep = React.useCallback(flow?.hasPreviousStep || ((): boolean => emptyFn(false)), [flow]);

	const clearHistory = React.useCallback(flow?.clearHistory || ((): void => emptyFn()), [flow]);

	

	return React.useMemo(
		() => ({
			back: (): void => {
				back?.();
			},
			currentFlow:flow,
			clearHistory,
			dispatch: handleDispatch,
			getCurrentStep,
			getHistory,
			getLastAction,
			getPreviousStep,
			hasPreviousStep,
			refresh: (): void => {
				refresh?.();
			},
		}),
		[
			back,
			flow,
			clearHistory,
			getCurrentStep,
			getHistory,
			getLastAction,
			getPreviousStep,
			handleDispatch,
			hasPreviousStep,
			refresh,
		]
	);
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useFlowManager = () => {
	const { currentFlowName, start, fm ,flowState} = React.useContext(flowManagerContext);

	const handleStart = React.useCallback(
		({ flowName = currentFlowName, stepName, options }: TFlowManagerStartMethodInput): void => {
			start(flowName, stepName, options);
		},
		[start]
	);

	return React.useMemo(
		() => ({
			fm,
			flowState,
			currentFlowName,
			start: handleStart,
			clearAllHistory: fm.clearAllHistory,
		}),
		[currentFlowName,flowState,fm, fm.clearAllHistory, handleStart]
	);
};
