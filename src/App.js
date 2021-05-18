import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, PermissionsAndroid, Platform, Image } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import showToast from './components/Toast'
import CityService from './services/cityService'

const validation = {
  IsValid : 'IsValid',
  IsNotValid : 'IsNotValid'
}; 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validCity: ''
    }
  }

  validateLocation = async () => {
    await this.getDeviceLocation();
  }

  getCurrentCityName = async (latitude, longitude) => {
    let cityName = ''
    const geoResponse = await CityService.getGeoAddresFromLatLng(latitude, longitude);
    if (geoResponse &&
      geoResponse.status &&
      geoResponse.status == 'OK' &&
      geoResponse.results &&
      geoResponse.results.length > 0 &&
      geoResponse.results[0] &&
      geoResponse.results[0].address_components &&
      geoResponse.results[0].address_components.length > 0) {
      let city = geoResponse.results[0].address_components.filter(
        (item) =>
          item.types.includes('locality'),
      );
      if (city && city.length > 0 && city[0] && city[0].long_name) {
        cityName = city[0].long_name;
      }
    }
    return cityName;
  }

  getValidCity = async (cityName) => {
    let validCity = ''
    const response = await CityService.getCityList();
    if (response && response.length > 0) {
      let filteredCity = response.find(x => x.name === cityName)
      if (filteredCity) {
        validCity = validation.IsValid
        this.setState({ validCity })
      } else {
        validCity = validation.IsNotValid
        this.setState({ validCity })
      }
    }
  }

  //New Location Library implementation
  async getDeviceLocation() {
    try {
      let isPermissionGranted = false;
      if (Platform.OS === 'android') {
        isPermissionGranted = await this.requestLocationPermissionForAndroid();
      } else {
        const status = await Geolocation.requestAuthorization('whenInUse');
        if (status === 'granted') {
          isPermissionGranted = true;
        }
      }
      if (isPermissionGranted) {
        Geolocation.getCurrentPosition(
          async (position) => {
            if (
              position &&
              position != null &&
              position.coords &&
              position.coords.latitude &&
              position.coords.longitude
            ) {
              const cityName = await this.getCurrentCityName(position.coords.latitude, position.coords.longitude)
              if (cityName && cityName != '') {
                validCity = await this.getValidCity(cityName)
              }
            } else {
              showToast(
                'Location services currently unavailable, please try again later!',
              );
            }
            //
          },
          (error) => {
            showToast(
              'Location services currently unavailable, please try again later!',
            );
            console.log(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          },
        )
      } else {
        showToast(
          "To use this functionality allow to access this device's location",
        );
      }
    } catch (e) {
      console.log(e);
      showToast('Something went wrong');
    }
  }

  requestLocationPermissionForAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === 'granted') {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  render() {
    const { validCity } = this.state
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <TouchableOpacity style={styles.button}
            onPress={() => this.validateLocation()}>
            <View style={styles.buttonView}>
              <Text style={styles.buttonTitle}>Validate My Location</Text>
            </View>
          </TouchableOpacity>
          {validCity === validation.IsValid ?
            <View style={{ marginHorizontal: 14, marginVertical: 14 }}>
              <Image width={15} height={15} resizeMode= 'center' source={require('./assets/success.png')} />
            </View> : null}
          {validCity === validation.IsNotValid ?
            <View style={{ marginHorizontal: 14, marginVertical: 14 }}>
              <Image width={15} height={15} resizeMode= 'center' source={require('./assets/failed.png')} />
            </View> : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cafc03'
  },
  subContainer: {
    flex: 1,
    marginHorizontal: 14,
    marginVertical: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fca503',
    borderRadius: 6
  },
  buttonView: {
    marginHorizontal: 20,
    marginVertical: 20
  },
  buttonTitle: {
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default App;