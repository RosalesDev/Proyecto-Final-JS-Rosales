let lastRequest = Date.now();
let timeElapsed = 0;
let weatherData = undefined;

export function fetchWeatherData(nav) {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  let url = "";

  const weatherContainer = document.createElement("div");
  nav.appendChild(weatherContainer);

  function success(position) {
    const key = "305629b11253d1a07f08caaba6362edb";
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=es`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        nav.childNodes[7].remove();
        let weatherWidget = document.createElement("div");
        weatherWidget.className =
          "row justify-content-center align-items-center";

        const iconId = data.weather[0].icon;
        weatherData = {
          weatherIconUrl: `https://openweathermap.org/img/wn/${iconId}@2x.png`,
          city: data.name,
          temp: data.main.feels_like,
          weather: data.weather[0].description,
        };

        weatherWidget.innerHTML = `
        <div class='col text-center text-light'>
          <img src=${weatherData.weatherIconUrl} alt="Weather Icon" height="30">
          <span class='d-block text-capitalize text-nowrap'>${weatherData.weather}</span>
        </div>
        <div class='col text-light'>
          <span class='d-block text-nowrap'>${weatherData.city}</span>
          <span class='d-block text-nowrap'>${weatherData.temp} ºC</span>
        </div>`;
        nav.appendChild(weatherWidget);
      })
      .catch(() => error());
  }

  function error() {
    nav.childNodes[7].remove();
    let weatherWidget = document.createElement("div");
    weatherWidget.style.color = "white";
    weatherWidget.innerHTML = `ERROR :(`;
    nav.appendChild(weatherWidget);
  }

  timeElapsed = (Date.now() - lastRequest) / 60000;

  if (timeElapsed > 5 || weatherData == undefined) {
    navigator.geolocation.getCurrentPosition(success, error, options);
  }
}
