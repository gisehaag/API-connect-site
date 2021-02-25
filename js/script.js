import icons from './icons.js';

class weatherApp {
	constructor() {
		this.container = document.querySelector('.container');
		this.assingElements();
		this.getGeolocation();
		this.addEvents();
	}

	assingElements() {
		this.apiKey = "c00b4b29cd8af0576010b2bbfd606608";

		this.input = this.container.querySelector('#city');
		this.button = this.container.querySelector('#button');

		this.location = this.container.querySelector('.location');
		this.date = this.container.querySelector('.date');
		this.extremes = this.container.querySelector('.extremes');
		this.weatherIcon = this.container.querySelector('.weather-icon');
		this.weatherDesc = this.container.querySelector('.weather-desc');
		this.temp = this.container.querySelector('.temp');
		this.feelsLike = this.container.querySelector('.feels-like');

		this.icons = this.container.querySelector('.icons');
	}

	addEvents() {
		this.button.addEventListener('click', this.getWeather.bind(this));

	}

	async getGeolocation() {
		if (navigator.geolocation) {
			try {
				const position = await this.geolocateUser();
				const lat = position.coords.latitude;
				const lon = position.coords.longitude;
				this.url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
				this.getWeather();

			} catch (e) {
				console.error(e);
			}
		}
	}

	geolocateUser() {
		return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
	}

	getWeather() {
		console.log('consultando...');

		if (this.input.value != '') {
			const city = this.input.value;
			this.url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}`;
		}

		fetch(this.url)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				this.weatherData = data;
				this.input.value = '';
				this.displayData();
			})
			.catch(e => console.error(e));
	};

	displayData() {
		let city = this.weatherData.name;
		let country = this.weatherData.sys.country;
		let currentDate = moment().format('MMMM DD, HH:mm');
		let tempMinC = Math.floor((this.weatherData.main.temp_min - 273.15));
		let tempMaxC = Math.ceil((this.weatherData.main.temp_max - 273.15));
		let id = this.weatherData.weather[0].id;
		let description = this.weatherData.weather[0].description;
		let temp = Math.floor((this.weatherData.main.temp - 273.15));
		let feels = Math.floor((this.weatherData.main.feels_like - 273.15));


		this.location.innerHTML = `
		<span class="icon-location1"></span>
		${city}, ${country}
		`;

		this.date.innerHTML = `${currentDate}`;

		this.extremes.innerHTML += `
		Day ${tempMaxC}º <span class="icon-long-arrow-up"></span> ·
		Night ${tempMinC}º <span class="icon-long-arrow-down"></span>
		`;

		// console.log(id, icons[id]);
		// this.weatherIcon.innerHTML = `<img width="100" src="./svg/${icons[id]}"></img>`;
		this.weatherDesc.innerHTML = `${description}`;
		this.temp.innerHTML = `${temp}º <span class="superindex">C</span>`;

		this.feelsLike.innerHTML = `Feels Like ${feels}º`;

		this.displayIcons();

	};

	displayIcons() {
		let sunriseHm = moment.unix(this.weatherData.sys.sunrise).format('HH:mm');
		let sunsetHm = moment.unix(this.weatherData.sys.sunset).format('HH:mm');

		let sunrise = this.weatherData.sys.sunrise;
		let sunset = this.weatherData.sys.sunset;
		let time = parseInt(moment().format('X'));
		let id = this.weatherData.weather[0].id;


		const isDay = (time > sunrise && time < sunset) ? true : false;

		let iconSet = (isDay) ? icons.dayIcons : icons.nightIcons;

		console.log(iconSet);

		this.weatherIcon.innerHTML = `<img width="100" src="./svg/${iconSet[id]}"></img>`;


		// this.icons.innerHTML += `<p>generic icons</p>`;
		// for (let key in icons.genericIcons) {
		// 	this.icons.innerHTML += `<span>${icons.genericIcons[key]}</span> <img width="30" src="./otros-svg/${icons.genericIcons[key]}"><br>`;
		// }

		// this.icons.innerHTML += `<p>day icons</p>`;
		// for (let key in icons.dayIcons) {
		// 	this.icons.innerHTML += `<span>${icons.dayIcons[key]}</span> <img width="30" src="./otros-svg/${icons.dayIcons[key]}"><br>`;
		// }

		// this.icons.innerHTML += `<p>icon set</p>`;
		// for (let key in iconSet) {
		// 	this.icons.innerHTML += `<span>${iconSet[key]}</span> <img width="30" src="./svg/${iconSet[key]}"><br>`;
		// }


	};
}

let app = new weatherApp;








