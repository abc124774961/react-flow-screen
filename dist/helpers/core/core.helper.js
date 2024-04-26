"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreHelper = void 0;
class CoreHelper {
}
exports.CoreHelper = CoreHelper;
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
CoreHelper.getValueOrDefault = (value, defaultValue) => {
    return value === undefined ? defaultValue : value;
};
CoreHelper.getPropertyValue = (obj, propName, defaultValue) => {
    return CoreHelper.getValueOrDefault(obj.hasOwnProperty(propName) ? obj[propName] : undefined, defaultValue);
};
