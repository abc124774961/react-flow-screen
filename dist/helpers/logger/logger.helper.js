"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerHelper = void 0;
const helpers_1 = require("../../helpers");
class LoggerHelper {
}
exports.LoggerHelper = LoggerHelper;
LoggerHelper._groups = {
    all: false,
};
LoggerHelper.isGroupActive = ({ group, type }) => {
    const all = helpers_1.CoreHelper.getPropertyValue(LoggerHelper._groups, 'all', false);
    const allByType = helpers_1.CoreHelper.getPropertyValue(all, type);
    const value = helpers_1.CoreHelper.getPropertyValue(LoggerHelper._groups, group, false);
    const valueByType = helpers_1.CoreHelper.getPropertyValue(value, type);
    return allByType !== undefined
        ? allByType
        : all !== undefined && typeof all === 'boolean'
            ? all
            : valueByType !== undefined
                ? valueByType
                : value;
};
LoggerHelper.treatLogger = (type) => (group) => (msg, ...args) => {
    if (!LoggerHelper.isGroupActive({ group, type })) {
        return;
    }
    try {
        // eslint-disable-next-line no-console
        console[type].apply(msg, [new Date().toUTCString(), msg, ...args]);
    }
    catch (err) {
        if (!LoggerHelper.isGroupActive({ group, type: 'error' })) {
            return;
        }
        // eslint-disable-next-line no-console
        console.error('LoggerHelper > treatLogger', err);
    }
};
LoggerHelper.init = (groups) => {
    LoggerHelper._groups = Object.assign(Object.assign({}, LoggerHelper._groups), groups);
};
LoggerHelper.error = LoggerHelper.treatLogger('error');
LoggerHelper.log = LoggerHelper.treatLogger('log');
LoggerHelper.warn = LoggerHelper.treatLogger('warn');
