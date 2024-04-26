"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Step = void 0;
class Step {
    constructor(name, loader, options) {
        this.name = name;
        this.loader = loader;
        this.options = options;
        this.actions = {};
    }
}
exports.Step = Step;
