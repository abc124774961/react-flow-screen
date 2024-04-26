import React from 'react';
import './placeholder.styles.css';
export interface PlaceholderProps {
    loading: boolean;
    style?: React.CSSProperties;
}
export declare const Placeholder: React.FC<PlaceholderProps>;
