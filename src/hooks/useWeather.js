import {useState} from 'react';

import {weatherKey} from '../../app.json';

export const useWeather = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState({
    city: '',
    isoCountry: '',
    icon: '',
    temperature: '',
    mainInfo: '',
    description: '',
    humidity: '',
    pressure: '',
    wind: '',
  });

  const _normalizeData = data => {
    console.log('normalizeData is: ', data);
    setWeatherData({
      city: data.name,
      isoCountry: data.sys.country,
      icon: data.weather[0].icon,
      temperature: `${(data.main.temp - 273.15).toFixed(1)} °C`,
      mainInfo: data.weather[0].main,
      description: data.weather[0].description,
      humidity: `${data.main.humidity} %`,
      pressure: `${(data.main.pressure * 0.75).toFixed(0)} mmHg`,
      wind: `${(data.wind.speed * 3.6).toFixed(1)} km/h`,
    });
  };

  const fetchByCoords = async (lat, lon) => {
    setIsLoading(true);
    try {
      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}`,
      );
      const curLocationWeather = await resp.json();
      _normalizeData(curLocationWeather);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const fetchByCityName = async cityName => {
    setIsLoading(true);
    try {
      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherKey}`,
      );
      const enteredCityWeather = await resp.json();
      _normalizeData(enteredCityWeather);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    weatherData,
    fetchByCoords,
    fetchByCityName,
  };
};
