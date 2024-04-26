export declare class CoreHelper {
    /**
     * This method allow get value when is defined or a default value
     *
     * @example CoreHelper.getValueOrDefault('test', 'default'); => return 'test'
     * @example CoreHelper.getValueOrDefault(undefined, 'default'); => return 'default'
     *
     * @param value the value check if is defined to return
     * @param defaultValue default value returned when value is undefined
     * @returns the value when is defined or default value in otherwise
     */
    static getValueOrDefault: <TValue extends unknown>(value: TValue, defaultValue: TValue) => TValue;
    static getPropertyValue: <TCollection extends Record<string, any>>(obj: TCollection, propName: string, defaultValue?: any) => any;
}
