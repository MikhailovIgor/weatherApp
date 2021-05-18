import React from 'react';
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
import csc from 'country-state-city';
import Icon from 'react-native-vector-icons/AntDesign';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const WEATHER_KEY = 'cdd1f36de739293fbc91df9a445b4f5c';

export default class App extends React.Component {
  state = {
    currentLat: '',
    currentLon: '',
    data: [],
    isoCountry: '',
    listOfCities: [],
    isLoading: true,
    temp: '',
    cityFromInput: '',
    icon: '',
    cityName: '',
    desc: '',
    main: '',
    humidity: '',
    pressure: '',
    wind: '',
  };

  componentDidMount() {
    Geolocation.getCurrentPosition(({coords}) => {
      console.log('my current coords: ', coords);
      this.setState({
        currentLat: coords.latitude,
        currentLon: coords.longitude,
      });
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${this.state.currentLat}&lon=${this.state.currentLon}&appid=${WEATHER_KEY}`,
      )
        .then(response => response.json())
        .then(json => {
          console.log(json);
          this.setState({data: json});
          this.setState({temp: (json.main.temp - 273.15).toFixed(1) + ' °C'});
          this.setState({cityName: json.name});
          this.setState({isoCountry: json.sys.country});
          this.setState({icon: json.weather[0].icon});
          this.setState({desc: json.weather[0].description});
          this.setState({main: json.weather[0].main});
          this.setState({humidity: json.main.humidity + ' %'});
          this.setState({
            pressure: (json.main.pressure * 0.75).toFixed(0) + ' mmHg',
          });
          this.setState({
            wind: (json.wind.speed * 3.6).toFixed(1) + ' Km/h',
          });
        })
        .then(() => {
          const listOfCities = csc.getCitiesOfCountry(this.state.isoCountry);
          this.setState({listOfCities});
        })
        .catch(err => console.log('error from mounting: ', err))
        .finally(() => {
          this.setState({isLoading: false});
        });
    });
  }

  fetchWeather = () => {
    Keyboard.dismiss();
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${this.state.cityFromInput}&appid=${WEATHER_KEY}`,
    )
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({data: json});
        this.setState({temp: (json.main.temp - 273.15).toFixed(1) + ' °C'});
        this.setState({isoCountry: json.sys.country});
        this.setState({cityName: json.name});
        this.setState({icon: json.weather[0].icon});
        this.setState({desc: json.weather[0].description});
        this.setState({main: json.weather[0].main});
        this.setState({humidity: json.main.humidity + ' %'});
        this.setState({
          pressure: (json.main.pressure * 0.75).toFixed(0) + ' mmHg',
        });
        this.setState({
          wind: (json.wind.speed * 3.6).toFixed(1) + ' Km/h',
        });
      })
      .catch(err => console.log('error from fetchWeather: ', err.message))
      .finally(() => {
        this.setState({isLoading: false});
      });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar translucent={true} backgroundColor="#000" />
        <ImageBackground
          source={require('./assets/images/background.jpeg')}
          style={styles.imageBackgroundStyle}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#FFF"
              style={styles.inputStyle}
              onChangeText={text => this.setState({cityFromInput: text})}
            />
            <TouchableOpacity
              style={styles.iconSearchStyle}
              onPress={this.fetchWeather}>
              <Icon name="search1" size={30} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoMainContainer}>
            <View style={styles.weatherMainInfo}>
              <Image
                source={{
                  uri: `http://openweathermap.org/img/wn/${this.state.icon}@2x.png`,
                }}
                style={styles.weatherImage}
              />
              <View>
                <Text style={styles.temperatureStyle}>{this.state.temp}</Text>
                <Text style={styles.cityNameStyle}>{this.state.cityName}</Text>
              </View>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <View style={styles.weatherDescription}>
              <Text style={styles.weatherDescriptionMainText}>
                {this.state.main}
              </Text>
              <Text style={styles.weatherDescriptionText}>
                {this.state.desc}
              </Text>
              <Text style={styles.humidityInfoStyle}>
                Humidity : {this.state.humidity}
              </Text>
              <Text style={styles.otherInfoStyle}>
                Pressure : {this.state.pressure}
              </Text>
              <Text style={styles.otherInfoStyle}>
                Wind : {this.state.wind}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

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
