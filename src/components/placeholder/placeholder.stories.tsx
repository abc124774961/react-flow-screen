//@ts-nocheck
import React from 'react';
import { Placeholder, PlaceholderProps } from '.';


const template = props => (
	<div style={{ height: '50px' }}>
		<Placeholder {...props} />
	</div>
);

export const Loading = template.bind({});

Loading.args = {
	children: <h1>Placeholder example</h1>,
	loading: true,
} as PlaceholderProps;

export const Loaded = template.bind({});

Loaded.args = {
	children: <h1>Placeholder example</h1>,
	loading: false,
} as PlaceholderProps;
