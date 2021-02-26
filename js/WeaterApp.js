import icons from './icons.js';
import background from './background.js';

class WeatherApp {
	constructor(config) {
		if (!config.apiKey) {
			console.error('⚠ You must have an API Key!');
			return;
		}

		this.container = document.querySelector('.container');
		this.apiKey = config.apiKey
		this.assingElements();
		this.getGeolocation();
		this.addEvents();
	}

	assingElements() {

		this.input = this.container.querySelector('#city');
		this.button = this.container.querySelector('#button');

		this.mainBox = this.container.querySelector('main');
		this.errorMessage = this.container.querySelector('.error-message');
		this.infoApp = this.container.querySelector('.info-app');

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
				if (data.cod == '404') {
					this.displayErrorMessage(data.message);
					return;
				}
				console.log(data);
				this.weatherData = data;
				this.input.value = '';
				this.displayData();
			})
			.catch(e => {
				console.error(e);
			});
	};

	displayData() {
		this.mainBox.style.height = 'auto';
		this.errorMessage.innerHTML = ``;

		const city = this.weatherData.name;
		const country = this.weatherData.sys.country;
		const currentDate = moment().format('MMMM DD, HH:mm');
		const tempMinC = Math.floor((this.weatherData.main.temp_min - 273.15));
		const tempMaxC = Math.ceil((this.weatherData.main.temp_max - 273.15));
		const description = this.weatherData.weather[0].description;
		const temp = Math.floor((this.weatherData.main.temp - 273.15));
		const feels = Math.floor((this.weatherData.main.feels_like - 273.15));

		const sunrise = this.weatherData.sys.sunrise;
		const sunset = this.weatherData.sys.sunset;
		const time = parseInt(moment().format('X'));
		const id = this.weatherData.weather[0].id;

		this.isDay = (time > sunrise && time < sunset) ? true : false;
		const iconSet = (this.isDay) ? icons.dayIcons : icons.nightIcons;


		this.infoApp.innerHTML = `
			<div class="location">
				<span class="icon-location1"></span>You are in: ${city}, ${country}
			</div>
			<div class="wrapper" id="info">
				<p class="small back-text date">Today is ${currentDate}</p>
				<p class="small white-text extremes">
					<img width="25" src="./svg/thermometer.svg" alt="celsius degree" />
					Day ${tempMaxC}º <span class="icon-long-arrow-up"></span> ·
					Night ${tempMinC}º <span class="icon-long-arrow-down"></span>
				</p>
				<div class="current">
					<div id="icon">
						<span class="weather-icon"><img width="100" src="./svg/${iconSet[id]}"></img></span>
						<span class="small weather-desc">${description}</span>
					</div>
					<p class="big white-text temp">${temp}º <span class="superindex">C</span></p>
				</div>
				<p class="small white-text feels-like">Feels Like ${feels}º</p>
			</div>
		`;

		this.displayBackground();
	};

	displayErrorMessage(message) {
		this.errorMessage.innerHTML = `Sorry, ${message}, please try again 💚`;
		this.infoApp.innerHTML = ``;
		this.assingElements();
	}

	displayBackground() {
		const clouds = this.weatherData.clouds;
		const colorText = (this.isDay) ? '#000' : '#fff';
		this.container.style.color = colorText;

		const dayOrNight = (this.isDay) ? 'day' : 'night';
		const clearOrCloudy = (clouds.all < 50) ? 'clear' : 'cloudy';
		const backgroundColor = background[dayOrNight][clearOrCloudy];
		this.container.style.background = backgroundColor;
	};
}

export default WeatherApp;