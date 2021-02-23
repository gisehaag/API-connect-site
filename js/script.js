class weatherApp {

	constructor() {
		this.container = document.querySelector('.container');
		this.weatherData = {};
		this.assingElements();
		this.addEvents();
	}

	assingElements() {
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

	getWeather() {
		console.log('consultando...');

		let city = this.input.value;
		const apiKey = "c00b4b29cd8af0576010b2bbfd606608";
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

		fetch(url)
			.then(response => response.json())
			.then(data => this.getData(data))
			.then(this.input.value = '')
			.then(this.displayData.bind(this));
	};

	getData(data) {
		this.weatherData = data;
	}

	displayData() {
		console.log(this.weatherData);
		let tempMinC = Math.round((this.weatherData.main.temp_min - 273.15));
		let tempMaxC = Math.round((this.weatherData.main.temp_max - 273.15));
		this.extremes.innerHTML = `Day ${tempMaxC} <span class="icon-long-arrow-up"></span>
		 									· Night ${tempMinC} <span class="icon-long-arrow-down"></span>`

		// this.info.innerHTML += `<p>la cuidad consultada es </p>
		// <img scr="http://openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png">`;
	}
}

let app = new weatherApp;








