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

// Display the 5-day forecast to HTML
var getFiveDayForecast = (event) => {
    let city = $('#search-city').val();

    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=" + myOpenWeatherAPI;

    // Fetch from API
    fetch(queryURL)
        .then(handleErrors)
        .then((response) => {
            return response.json();
        })
        .then((response) => {

            let fiveDayForecastHTML = `
        <h2>5-Day Forecast:</h2>
        <div id="fiveDayForecastUl" class="flex-wrap d-inline-flex">`;

            // Loop over the 5-day forecast
            for (let i = 0; i < response.list.length; i++) {
                let dayData = response.list[i];
                let dayTimeUTC = dayData.dt;
                let timeZoneOffset = response.city.timezone;
                let timeZoneOffsetHours = timeZoneOffset / 60 / 60;
                let thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeZoneOffsetHours);
                let iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";

                if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss") === "13:00:00") {
                    fiveDayForecastHTML += `
                <div class="weather-card card m-2 p0">
                    <ul class="list-unstyled p-3">
                        <li>${thisMoment.format("MM/DD/YY")}</li>
                        <li class="weather-icon"><img src="${iconURL}"></li>
                        <li>Temp: ${dayData.main.temp}&#8457;</li>
                        <br>
                        <li>Wind: ${dayData.wind.speed} MPH</li>
                        <br>
                        <li>Humidity: ${dayData.main.humidity}%</li>
                    </ul>
                </div>`;
                }
            }
            fiveDayForecastHTML += `</div>`;
            // Append 5-day forecast to DOM
            $('#five-day-forecast').html(fiveDayForecastHTML);
        })
}

// Save city to localStorage
var saveCity = (newCity) => {
    let cityExists = false;

    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage["cities" + i] === newCity) {
            cityExists = true;
            break;
        }
    }

    if (cityExists === false) {
        localStorage.setItem('cities' + localStorage.length, newCity);
    }
}

// Show list of previously entered cities
var renderCities = () => {
    $('#city-results').empty();
    // If localStorage is empty
    if (localStorage.length === 0) {
        if (lastCity) {
            $('#search-city').attr("value", lastCity);
        }
    } else {

        let lastCityKey = "cities" + (localStorage.length - 1);
        lastCity = localStorage.getItem(lastCityKey);

        $('#search-city').attr("value", lastCity);

        // Append stored cities to page
        for (let i = 0; i < localStorage.length; i++) {
            let city = localStorage.getItem("cities" + i);
            let cityEl;

            if (currentCity === "") {
                currentCity = lastCity;
            }

            if (city === currentCity) {
                cityEl = `<button type="button" class="list-group-item list-group-item-action active">${city}</button></li>`;
            } else {
                cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;
            }

            $('#city-results').prepend(cityEl);
        }
        // If there is a list of cities, add "clear" button
        if (localStorage.length > 0) {
            $('#clear-storage').html($('<a id="clear-storage" href="#">clear</a>'));
        } else {
            $('#clear-storage').html('');
        }
    }

}
