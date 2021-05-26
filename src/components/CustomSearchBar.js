import React, {useState} from 'react';
import {View, FlatList, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';

const CustomSearchBar = ({listOfCities, fetchWeather}) => {
  const [inputValue, setInputValue] = useState('');

  const ItemView = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        fetchWeather(item.name);
        setInputValue('');
      }}>
      <Text style={styles.itemStyle}>{item.name}</Text>
    </TouchableOpacity>
  );

  const ItemSeparatorLine = () => <View style={styles.itemSeparatorStyle} />;

  return (
    <View style={styles.inputBox}>
      <Input
        inputContainerStyle={styles.inputContainerStyle}
        style={{color: '#fff'}}
        placeholderTextColor="#fff"
        placeholder="Enter a city name..."
        value={inputValue}
        onChangeText={setInputValue}
        rightIcon={
          <TouchableOpacity
            onPress={() => {
              fetchWeather(inputValue);
              setInputValue('');
            }}>
            <Icon name="search1" size={28} color="#fff" />
          </TouchableOpacity>
        }
      />
      {inputValue.length ? (
        <FlatList
          keyboardShouldPersistTaps="always"
          keyExtractor={item => item.longitude}
          ItemSeparatorComponent={ItemSeparatorLine}
          style={styles.FlatListStyle}
          data={listOfCities.filter(item => item.name.includes(inputValue))}
          renderItem={ItemView}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  itemStyle: {
    padding: 15,
    color: '#fff',
  },
  itemSeparatorStyle: {
    height: 0.5,
    backgroundColor: '#c8c8c8',
  },
  inputBox: {
    height: '25%',
    width: '100%',
    marginTop: '10%',
  },
  inputContainerStyle: {
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  FlatListStyle: {
    paddingHorizontal: 15,
    marginTop: -24,
    height: '65%',
  },
});

export default CustomSearchBar;
