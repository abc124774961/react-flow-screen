"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
const react_1 = __importDefault(require("react"));
class ErrorBoundary extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    componentDidCatch(error, info) {
        this.setState(Object.assign(Object.assign({}, this.state), { error, hasError: true }));
    }
    render() {
        const { containerErrorMessage } = this.props;
        const { error } = this.state;
        if (this.state.hasError) {
            return ((containerErrorMessage &&
                containerErrorMessage(typeof error === 'object' ? JSON.stringify(error) : error)) ||
                null);
        }
        //@ts-ignore
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
