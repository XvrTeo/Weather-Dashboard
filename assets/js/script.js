// Assign my personal OpenWeatherMap API Key to variable
var myOpenWeatherAPI = "8f1f2e5131ba6e70598a3a54a084a954";
var currentCity = "";
var lastCity = "";

// Error handler for fetch
var handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

// Display current weather conditions
var getCurrentConditions = (event) => {
    let city = $('#search-city').val();
    currentCity = $('#search-city').val();

    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + myOpenWeatherAPI;
    fetch(queryURL)
        .then(handleErrors)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            // Save city to local storage
            saveCity(city);
            $('#search-error').text("");

            // Display image reflecting current weather
            let currentWeatherIcon = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";

            // Use moment.js to offset UTC timezone
            let currentTimeUTC = response.dt;
            let currentTimeZoneOffset = response.timezone;
            let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
            let currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);

            renderCities();

            // Obtain the 5-day forecast for entered city in search field
            getFiveDayForecast(event);

            let currentWeatherHTML = `
            <h3>${response.name} ${currentMoment.format("(MM/DD/YY)")}<img src="${currentWeatherIcon}"></h3>
            <ul class="list-unstyled">
                <li>Temp: ${response.main.temp}&#8457;</li>
                <br>
                <li>Wind: ${response.wind.speed} MPH</li>
                <br>
                <li>Humidity: ${response.main.humidity}%</li>
            </ul>`;

            $('#current-weather').html(currentWeatherHTML);
        })
}
