import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Image,
  ImageBackground,
  StatusBar,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import csc from 'country-state-city';

import CustomSearchBar from './components/CustomSearchBar';
import {weatherKey} from '../app.json';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const App = () => {
  const [coords, setCoords] = useState({
    currentLatitude: '',
    currentLongitude: '',
  });
  const [data, setData] = useState({
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
  const [listOfCities, setListOfCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(initialData => {
      setCoords({
        currentLatitude: initialData.coords.latitude,
        currentLongitude: initialData.coords.longitude,
      });
    });
  };

  useEffect(() => {
    const fetchCurrentLocationWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.currentLatitude}&lon=${coords.currentLongitude}&appid=${weatherKey}`,
        );
        const curWeatherData = await response.json();
        setData({
          city: curWeatherData.name,
          isoCountry: curWeatherData.sys.country,
          icon: curWeatherData.weather[0].icon,
          temperature: `${(curWeatherData.main.temp - 273.15).toFixed(1)} °C`,
          mainInfo: curWeatherData.weather[0].main,
          description: curWeatherData.weather[0].description,
          humidity: `${curWeatherData.main.humidity} %`,
          pressure: `${(curWeatherData.main.pressure * 0.75).toFixed(0)} mmHg`,
          wind: `${(curWeatherData.wind.speed * 3.6).toFixed(1)} km/h`,
        });
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };

    if (coords.currentLatitude && coords.currentLongitude) {
      setIsLoading(true);
      fetchCurrentLocationWeather();
    }
  }, [coords]);

  useEffect(() => {
    setIsLoading(true);
    getCurrentLocation();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (data.isoCountry) {
      const arrOfCitiesOfCountry = csc.getCitiesOfCountry(data.isoCountry);
      setListOfCities(arrOfCitiesOfCountry);
    }
  }, [data.isoCountry]);

  const fetchWeather = async city => {
    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}`,
      );
      const enteredCityWeather = await response.json();
      setData({
        city: enteredCityWeather.name,
        isoCountry: enteredCityWeather.sys.country,
        icon: enteredCityWeather.weather[0].icon,
        temperature: `${(enteredCityWeather.main.temp - 273.15).toFixed(1)} °C`,
        mainInfo: enteredCityWeather.weather[0].main,
        description: enteredCityWeather.weather[0].description,
        humidity: `${enteredCityWeather.main.humidity} %`,
        pressure: `${(enteredCityWeather.main.pressure * 0.75).toFixed(
          0,
        )} mmHg`,
        wind: `${(enteredCityWeather.wind.speed * 3.6).toFixed(1)} km/h`,
      });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={true} backgroundColor="#000" />
      {isLoading && (
        <ActivityIndicator
          size={150}
          color="#ff5500"
          style={styles.spinnerStyle}
        />
      )}
      <ImageBackground
        source={require('./assets/images/background.jpeg')}
        style={styles.imageBackgroundStyle}>
        <CustomSearchBar
          listOfCities={listOfCities}
          fetchWeather={fetchWeather}
        />

        <View style={styles.infoMainContainer}>
          <View style={styles.weatherMainInfo}>
            <Image
              source={{
                uri: `http://openweathermap.org/img/wn/${data.icon}@2x.png`,
              }}
              style={styles.weatherImage}
            />
            <View>
              <Text style={styles.temperatureStyle}>{data.temperature}</Text>
              <Text style={styles.cityNameStyle}>{data.city}</Text>
              <Text style={styles.cityNameStyle}>{data.isoCountry}</Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <View style={styles.weatherDescription}>
            <Text style={styles.weatherDescriptionMainText}>
              {data.mainInfo}
            </Text>
            <Text style={styles.weatherDescriptionText}>
              {data.description}
            </Text>
            <Text style={styles.humidityInfoStyle}>
              Humidity : {data.humidity}
            </Text>
            <Text style={styles.otherInfoStyle}>
              Pressure : {data.pressure}
            </Text>
            <Text style={styles.otherInfoStyle}>Wind : {data.wind}</Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: DEVICE_HEIGHT,
    width: DEVICE_WIDTH,
  },
  imageBackgroundStyle: {
    height: '100%',
    width: '100%',
  },
  spinnerStyle: {
    height: DEVICE_HEIGHT,
    width: DEVICE_WIDTH,
    backgroundColor: 'transparent',
  },
  infoMainContainer: {
    height: '28%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  weatherMainInfo: {
    height: '86%',
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  weatherImage: {
    height: '80%',
    width: '50%',
  },
  temperatureStyle: {
    fontSize: 30,
    color: '#FFF',
    marginLeft: '5%',
  },
  cityNameStyle: {
    fontSize: 22,
    color: '#FFF',
    marginLeft: '5%',
    marginTop: '3%',
  },
  descriptionContainer: {
    height: '42%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherDescription: {
    height: '80%',
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
  },
  weatherDescriptionMainText: {
    fontSize: 28,
    color: '#464646',
    marginLeft: '8%',
    marginTop: '8%',
    fontWeight: 'bold',
  },
  weatherDescriptionText: {
    fontSize: 20,
    color: '#121212',
    marginLeft: '8%',
    marginTop: '3%',
  },
  humidityInfoStyle: {
    fontSize: 18,
    color: '#121212',
    marginLeft: '8%',
    marginTop: '5%',
  },
  otherInfoStyle: {
    fontSize: 18,
    color: '#121212',
    marginLeft: '8%',
    marginTop: '2%',
  },
});

export default App;
