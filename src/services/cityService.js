import APIClient from '../utilities/APIClient';
import cities from '../data/cities.json'

export default class CityService {

    static async getGeoAddresFromLatLng(latitude, longitude) {
        let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=your api key`;
        const response = await APIClient.get(url);
        return Promise.resolve(response.data);
    }

    static async getCityList(){
        let url = `https://uniquecityvalidator.azurewebsites.net/api/getValidAddresses?code=z3phTZQd6v0iluj5XJTrAF7kbLX0xr1j0LQCq34xQjWuH9DNIHgJww==&clientId=default&name=Bhuvin`
        const response = await APIClient.get(url);
        return Promise.resolve(response.data)
    }
}