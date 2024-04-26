type UseLoggerInput = string;
interface UseLoggerOutput {
    error: (msg: string, args: any) => void;
    log: (msg: string, args: any) => void;
    warn: (msg: string, args: any) => void;
}
export declare const useLogger: (group: UseLoggerInput) => UseLoggerOutput;
export declare const useLoggerFlow: () => UseLoggerOutput;
export {};
