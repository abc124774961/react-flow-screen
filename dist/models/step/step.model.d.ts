import React from 'react';
import { TStepAction, TStepOptions } from '../../types';
export declare class Step {
    name: string;
    loader: () => React.LazyExoticComponent<React.ComponentType<any>>;
    actions: Record<string, TStepAction>;
    options?: TStepOptions;
    constructor(name: string, loader: () => React.LazyExoticComponent<React.ComponentType<any>>, options?: TStepOptions);
}
