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
  TouchableOpacity,
  TextInput,
  Keyboard,
  FlatList,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/AntDesign';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const WEATHER_KEY = 'cdd1f36de739293fbc91df9a445b4f5c';

const App = () => {
  const [coords, setCoords] = useState({
    currentLatitude: '',
    currentLongitude: '',
  });
  const [cityFromInput, setCityFromInput] = useState('');
  const [data, setData] = useState([]);
  const [cityName, setCityName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [icon, setIcon] = useState('');
  const [temperature, setTemperature] = useState('');
  const [main, setMain] = useState('');
  const [description, setDescription] = useState('');
  const [humidity, setHumidity] = useState('');
  const [pressure, setPressure] = useState('');
  const [wind, setWind] = useState('');

  const getCurrentLocation = async () => {
    await Geolocation.getCurrentPosition(initialData => {
      setCoords({
        currentLatitude: initialData.coords.latitude,
        currentLongitude: initialData.coords.longitude,
      });
    });

    console.log(coords);
  };

  const fetchWeatherOfCurrentLocation = async () => {
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.currentLatitude}&lon=${coords.currentLongitude}&appid=${WEATHER_KEY}`,
    )
      .then(resp => resp.json())
      .then(data => {
        setData(data);
        setCityName(data.name);
        setIcon(data.weather[0].icon);
        setTemperature((data.main.temp - 273.15).toFixed(1) + ' °C');
        setMain(data.weather[0].main);
        setDescription(data.weather[0].description);
        setHumidity(data.main.humidity + ' %');
        setPressure((data.main.pressure * 0.75).toFixed(0) + ' mmHg');
        setWind((data.wind.speed * 3.6).toFixed(1) + ' km/h');

        console.log(data);
      })
      .catch(err => console.log('error from fetchWeatherOfCurrLoc: ', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    getCurrentLocation();
    // fetchWeatherOfCurrentLocation();
    setIsLoading(false);
  }, []);

  // useEffect(() => {
  //   setIsLoading(true);
  //   Geolocation.getCurrentPosition(initialData => {
  //     console.log('initialData from first part of useEffect: ', initialData);
  //     setCoords({
  //       currentLatitude: initialData.coords.latitude,
  //       currentLongitude: initialData.coords.longitude,
  //     });
  //   });
  //   console.log('coords from second part of useEffect: ', coords);
  //   fetch(
  //     `https://api.openweathermap.org/data/2.5/weather?lat=${coords.currentLatitude}&lon=${coords.currentLongitude}&appid=${WEATHER_KEY}`,
  //   )
  //     .then(resp => resp.json())
  //     .then(data => {
  //       setData(data);
  //       setCityName(data.name);
  //       setIcon(data.weather[0].icon);
  //       setTemperature((data.main.temp - 273.15).toFixed(1) + ' °C');
  //       setMain(data.weather[0].main);
  //       setDescription(data.weather[0].description);
  //       setHumidity(data.main.humidity + ' %');
  //       setPressure((data.main.pressure * 0.75).toFixed(0) + ' mmHg');
  //       setWind((data.wind.speed * 3.6).toFixed(1) + ' km/h');

  //       console.log(data);
  //     })
  //     .catch(err => console.log('error from fetchWeather: ', err))
  //     .finally(() => setIsLoading(false));
  // }, [coords, cityName]);

  const fetchWeather = () => {
    Keyboard.dismiss();
    setIsLoading(true);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityFromInput}&appid=${WEATHER_KEY}`,
    )
      .then(response => response.json())
      .then(data => {
        setData(data);
        setCityName(data.name);
        setIcon(data.weather[0].icon);
        setTemperature((data.main.temp - 273.15).toFixed(1) + ' °C');
        setMain(data.weather[0].main);
        setDescription(data.weather[0].description);
        setHumidity(data.main.humidity + ' %');
        setPressure((data.main.pressure * 0.0075).toFixed(0) + ' mmHg');
        setWind((data.wind.speed * 3.6).toFixed(1) + ' km/h');

        console.log(data);
      })
      .catch(err => console.log('error from fetchWeather: ', err))
      .finally(() => setIsLoading(false));
  };

  const enterCityName = value => {
    setCityFromInput(value);
    console.log(cityFromInput);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={true} backgroundColor="#000" />
      <ImageBackground
        source={require('./assets/images/background.jpeg')}
        style={styles.imageBackgroundStyle}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter city name..."
            placeholderTextColor="#FFF"
            style={styles.inputStyle}
            onChangeText={enterCityName}
          />
          <TouchableOpacity
            style={styles.iconSearchStyle}
            onPress={fetchWeather}>
            <Icon name="search1" size={30} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoMainContainer}>
          <View style={styles.weatherMainInfo}>
            <Image
              source={{uri: `http://openweathermap.org/img/wn/${icon}@2x.png`}}
              style={styles.weatherImage}
            />
            <View>
              <Text style={styles.temperatureStyle}>{temperature}</Text>
              <Text style={styles.cityNameStyle}>{cityName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <View style={styles.weatherDescription}>
            <Text style={styles.weatherDescriptionMainText}>{main}</Text>
            <Text style={styles.weatherDescriptionText}>{description}</Text>
            <Text style={styles.humidityInfoStyle}>Humidity : {humidity}</Text>
            <Text style={styles.other_text}>Pressure : {pressure}</Text>
            <Text style={styles.other_text}>Wind : {wind}</Text>
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
  inputContainer: {
    height: '20%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputStyle: {
    height: '35%',
    width: '77%',
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 15,
    color: '#FFF',
    paddingHorizontal: 15,
  },
  iconSearchStyle: {
    marginLeft: '5%',
    height: '35%',
    width: '8%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoMainContainer: {
    height: '30%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  weatherMainInfo: {
    height: '80%',
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
    fontSize: 20,
    color: '#FFF',
    marginLeft: '5%',
    marginTop: '3%',
  },
  descriptionContainer: {
    height: '45%',
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
