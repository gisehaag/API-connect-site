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

		const city = this.weatherData.name;
		const country = this.weatherData.sys.country;
		const currentDate = moment().format('MMMM DD, HH:mm');
		const tempMinC = Math.floor((this.weatherData.main.temp_min - 273.15));
		const tempMaxC = Math.ceil((this.weatherData.main.temp_max - 273.15));
		const description = this.weatherData.weather[0].description;
		const temp = Math.floor((this.weatherData.main.temp - 273.15));
		const feels = Math.floor((this.weatherData.main.feels_like - 273.15));

		const windSpeed = this.weatherData.wind.speed;
		const windKH = Math.round(windSpeed * 3.6);
		let windDir = windDirection[Object.keys(windDirection).find(dir => this.weatherData.wind.deg < dir)];
		const windIcon = (windSpeed < 15) ? './svg/wind.svg' : './svg/wind-sing.svg';

		const humidity = this.weatherData.main.humidity;
		const pressure = this.weatherData.main.pressure;



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
					<img width="30" src="./svg/thermometer.svg" alt="celsius degree" />
					Day ${tempMaxC}º <span class="icon-long-arrow-up"></span> ·
					Night ${tempMinC}º <span class="icon-long-arrow-down"></span>
				</p>
				<div class="current">
					<div id="icon">
						<span class="weather-icon"><img width="100" src="./svg/${iconSet[id]}"></img></span>
						<span class="small weather-desc">${description}</span>
					</div>
					<p class="big temp">${temp}º <span class="superindex">C</span></p>
				</div>
				<p class="feels-like">Feels Like ${feels}º</p>
				<p>
					<img width="20" src="${windIcon}" alt="wind-icon"/>
					${windKH}[km/h] from ${windDir}
				</p>
				<p>Humidity: ${humidity}%</p>
				<p>
					<img width="20" src="./svg/barometer.svg" alt="barometer-icon"/>
					Presure: ${pressure} hPa
				</p>

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

const app = new WeatherApp();