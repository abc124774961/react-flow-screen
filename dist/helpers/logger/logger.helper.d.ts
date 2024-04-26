import { Logger } from '../../types';
export declare class LoggerHelper {
    private static _groups;
    private static isGroupActive;
    private static treatLogger;
    static init: (groups: Record<string, boolean | Logger>) => void;
    static error: (group: string) => (msg: string, ...args: any) => void;
    static log: (group: string) => (msg: string, ...args: any) => void;
    static warn: (group: string) => (msg: string, ...args: any) => void;
}
