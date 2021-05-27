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
import {useWeather} from './hooks/useWeather';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const App = () => {
  const {isLoading, weatherData, fetchByCoords, fetchByCityName} = useWeather();
  const [listOfCities, setListOfCities] = useState([]);
  const [coords, setCoords] = useState({
    currentLatitude: '',
    currentLongitude: '',
  });

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(initialData => {
      setCoords({
        currentLatitude: initialData.coords.latitude,
        currentLongitude: initialData.coords.longitude,
      });
    });
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    const fetchCurrentLocationWeather = async (lat, lon) =>
      await fetchByCoords(lat, lon);
    if (coords.currentLatitude && coords.currentLongitude) {
      fetchCurrentLocationWeather(
        coords.currentLatitude,
        coords.currentLongitude,
      );
    }
  }, [coords]);

  useEffect(() => {
    if (weatherData.isoCountry) {
      const arrOfCitiesOfCountry = csc.getCitiesOfCountry(
        weatherData.isoCountry,
      );
      setListOfCities(arrOfCitiesOfCountry);
    }
  }, [weatherData.isoCountry]);

  const fetchWeather = async city => {
    Keyboard.dismiss();
    fetchByCityName(city);
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
                uri: `http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`,
              }}
              style={styles.weatherImage}
            />
            <View>
              <Text style={styles.temperatureStyle}>
                {weatherData.temperature}
              </Text>
              <Text style={styles.cityNameStyle}>{weatherData.city}</Text>
              <Text style={styles.cityNameStyle}>{weatherData.isoCountry}</Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <View style={styles.weatherDescription}>
            <Text style={styles.weatherDescriptionMainText}>
              {weatherData.mainInfo}
            </Text>
            <Text style={styles.weatherDescriptionText}>
              {weatherData.description}
            </Text>
            <Text style={styles.humidityInfoStyle}>
              Humidity : {weatherData.humidity}
            </Text>
            <Text style={styles.otherInfoStyle}>
              Pressure : {weatherData.pressure}
            </Text>
            <Text style={styles.otherInfoStyle}>Wind : {weatherData.wind}</Text>
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
