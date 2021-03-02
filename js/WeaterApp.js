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
		// API Documentation --> https://openweathermap.org/weather-data
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
				// console.log(data);
				this.weatherData = data;
				this.input.value = '';
				this.displayData();
			})
			.catch(e => {
				console.error(e);
			});
	};

	displayErrorMessage(message) {
		this.errorMessage.innerHTML = `Sorry, ${message}, please try again 💚`;
		this.infoApp.innerHTML = ``;
		this.assingElements();
	}

	displayData() {
		this.mainBox.style.height = 'auto';
		this.errorMessage.innerHTML = ``;

		this.getGeneralInfo();
		this.getTempertures();
		this.getWind();
		this.getIconSet();
		this.getBackground();

		this.infoApp.innerHTML = `
			<div>
				<span class="icon-location1"></span><span>You are in: ${this.city}, ${this.country}</span>
			</div>
			<div class="wrapper">
				<p class="date">Today is ${this.currentDate}</p>

				<div class="info-wrapper">
					<p class="small ${this.iconBG}">
						<img width="35" src="./svg/thermometer.svg" alt="celsius degree" />
						<span>Day ${this.tempMaxC}º <span class="icon icon-arrow-up"></span></span>
						<span>Night ${this.tempMinC}º <span class="icon icon-arrow-down"></span></span>
					</p>
				</div>

				<div class="current">
					<div id="icon">
						<p class="weather-icon"><img width="100" src="./svg/${this.iconSet[this.id]}"></img></p>
						<span class="small weather-desc">${this.description}</span>
					</div>
					<div>
						<p class="big">${this.temp}º<span class="superindex">c</span></p>
						<span>Feels Like ${this.feels}º</span>
					</div>
				</div>

				<div class="wrapper-info">
					<p class="small ${this.iconBG}">
						<img width="35" src="${this.windIcon}" alt="wind-icon"/>
						<span>Wind: ${this.windKMH} km/h from ${this.windDir}</span>
					</p>
					<p class="small ${this.iconBG}">
						<img width="35" src="./svg/humidity.svg" alt="humidity-icon"/>
						<span>Humidity: ${this.humidity} % </span>
					</p>
					<p class="small ${this.iconBG}">
						<img width="35" src="./svg/barometer.svg" alt="barometer-icon"/>
						<span>Pressure: ${this.pressure} hPa</span>
					</p>
				</div>
			</div>
		`;

		this.input.setAttribute("placeholder", " try another city");
	};

	getGeneralInfo() {
		const SEC_IN_HOUR = 3600;
		const timezone = this.weatherData.timezone / SEC_IN_HOUR;

		this.city = this.weatherData.name;
		this.country = this.weatherData.sys.country;
		this.description = this.weatherData.weather[0].description;
		this.pressure = this.weatherData.main.pressure;
		this.humidity = this.weatherData.main.humidity;

		this.currentDate = moment().utcOffset(timezone).format('MMMM DD, HH:mm');
	}

	getTempertures() {
		const KELVIN = 273.15;
		this.tempMinC = Math.floor((this.weatherData.main.temp_min - KELVIN));
		this.tempMaxC = Math.ceil((this.weatherData.main.temp_max - KELVIN));
		this.temp = Math.floor((this.weatherData.main.temp - KELVIN));
		this.feels = Math.floor((this.weatherData.main.feels_like - KELVIN));
	}

	getWind() {
		const MStoKMH = 3.6;
		const MAX_DIFF = 360;
		const windSpeed = this.weatherData.wind.speed;
		this.windIcon = (windSpeed < 15) ? './svg/wind.svg' : './svg/wind-sing.svg';
		this.windKMH = Math.round(windSpeed * MStoKMH);

		let diff = MAX_DIFF;
		let closer;

		Object.keys(windDirection).forEach(key => {
			let currentDiff = Math.abs(key - this.weatherData.wind.deg);

			if (currentDiff < diff) {
				diff = currentDiff;
				closer = key;
			}
		});

		this.windDir = windDirection[closer];
	}

	getIconSet() {
		const time = parseInt(moment().format('X'));
		const sunrise = this.weatherData.sys.sunrise;
		const sunset = this.weatherData.sys.sunset;

		this.isDay = (time > sunrise && time < sunset) ? true : false;
		this.iconSet = (this.isDay) ? icons.dayIcons : icons.nightIcons;
		this.id = this.weatherData.weather[0].id;
		this.iconBG = (!this.isDay) ? 'night' : '';
	}

	getBackground() {
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