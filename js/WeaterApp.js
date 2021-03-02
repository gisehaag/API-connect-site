import icons from './icons.js';
import background from './background.js';
import windDirection from './wind.js';

class WeatherApp {
	constructor() {
		this.container = document.querySelector('.container');
		this.apiKey = 'c00b4b29cd8af0576010b2bbfd606608';
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

		const KELVIN = 273.15;
		const city = this.weatherData.name;
		const country = this.weatherData.sys.country;
		const currentDate = moment().format('MMMM DD, HH:mm');
		const tempMinC = Math.floor((this.weatherData.main.temp_min - KELVIN));
		const tempMaxC = Math.ceil((this.weatherData.main.temp_max - KELVIN));
		const description = this.weatherData.weather[0].description;
		const temp = Math.floor((this.weatherData.main.temp - KELVIN));
		const feels = Math.floor((this.weatherData.main.feels_like - KELVIN));

		const windSpeed = this.weatherData.wind.speed;
		const MStoKMH = 3.6;
		const windKMH = Math.round(windSpeed * MStoKMH);
		// let windDir = windDirection[Object.keys(windDirection).find(dir => this.weatherData.wind.deg < dir)];

		const MAX_DIFF = 360;
		let diff = MAX_DIFF;
		let closer;

		Object.keys(windDirection).forEach(key => {
			let currentDiff = Math.abs(key - this.weatherData.wind.deg);

			if (currentDiff < diff) {
				diff = currentDiff;
				closer = key;
			}
		});

		let windDir = windDirection[closer];

		const windIcon = (windSpeed < 15) ? './svg/wind.svg' : './svg/wind-sing.svg';

		const humidity = this.weatherData.main.humidity;
		const pressure = this.weatherData.main.pressure;

		const sunrise = this.weatherData.sys.sunrise;
		const sunset = this.weatherData.sys.sunset;
		const time = parseInt(moment().format('X'));
		const id = this.weatherData.weather[0].id;

		this.isDay = (time > sunrise && time < sunset) ? true : false;
		const iconSet = (this.isDay) ? icons.dayIcons : icons.nightIcons;
		const iconBG = (!this.isDay) ? 'night' : '';



		this.infoApp.innerHTML = `
			<div>
				<span class="icon-location1"></span> You are in: ${city}, ${country}
			</div>
			<div class="wrapper">
				<p class="date">Today is ${currentDate}</p>
				<div class="info-wrapper">
					<p class="small ${iconBG}">
						<img width="35" src="./svg/thermometer.svg" alt="celsius degree" />
						<span>Day ${tempMaxC}º <span class="icon icon-arrow-up"></span></span>
						<span>Night ${tempMinC}º <span class="icon icon-arrow-down"></span></span>
					</p>
				</div>
				<div class="current">
					<div id="icon">
						<p class="weather-icon"><img width="100" src="./svg/${iconSet[id]}"></img></p>
						<span class="small weather-desc">${description}</span>
					</div>
					<div>
						<p class="big">${temp}º<span class="superindex">c</span></p>
						<span>Feels Like ${feels}º</span>
					</div>
				</div>
				<div class="wrapper-info">
					<p class="small ${iconBG}">
						<img width="35" src="${windIcon}" alt="wind-icon"/>
						Wind: ${windKMH} km/h from ${windDir}
					</p>
					<p class="small ${iconBG}">
						<img width="35" src="./svg/humidity.svg" alt="humidity-icon"/>
						Humidity: ${humidity} %</p>
					<p class="small ${iconBG}">
						<img width="35" src="./svg/barometer.svg" alt="barometer-icon"/>
						Pressure: ${pressure} hPa
					</p>
				</div>

			</div>
		`;

		this.input.setAttribute("placeholder", " try another city");

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

const app = new WeatherApp();