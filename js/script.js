import WeatherApp from './WeaterApp.js';

let config, app;

import('./config.js')
	.then(({ default: configData }) => {
		config = configData;
		app = new WeatherApp(config);
	})
	.catch(e => console.error('⚠ You must have a config file!'));












