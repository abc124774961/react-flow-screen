import React from 'react';
interface ErrorBoundaryProps {
    containerErrorMessage?: (error: string) => React.ReactNode;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error?: string | object;
}
export declare class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: {});
    componentDidCatch(error: any, info: any): void;
    render(): React.ReactNode;
}
export {};
