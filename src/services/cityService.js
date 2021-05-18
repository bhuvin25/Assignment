import APIClient from '../utilities/APIClient';
import cities from '../data/cities.json'

export default class CityService {

    static async getGeoAddresFromLatLng(latitude, longitude) {
        let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAuqZ4hU1vUqRjT6LQjZfH1TaTk4EmxOXY`;
        const response = await APIClient.get(url);
        return Promise.resolve(response.data);
    }

    static async getCityList(){
        const response = await cities
        return Promise.resolve(response)
    }
}