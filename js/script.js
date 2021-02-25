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
		let tempMinC = Math.floor((this.weatherData.main.temp_min - 273.15));
		let tempMaxC = Math.ceil((this.weatherData.main.temp_max - 273.15));
		this.extremes.innerHTML = `
			Day ${tempMaxC} <span class="icon-long-arrow-up"></span> ·
			Night ${tempMinC} <span class="icon-long-arrow-down"></span>
		`

		// this.info.innerHTML += `<p>la cuidad consultada es </p>
		// <img scr="http://openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png">`;
	}
}

let app = new weatherApp;








