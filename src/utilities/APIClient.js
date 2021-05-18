import Axios from 'axios';
import showToast from '../components/Toast'

export default class APIClient {

    static async get(url, params, showError = true) {
        return await Axios.get(url, params).catch((error) => {
            if (showError) {
                this.handleError(error);
            } else {
                throw error;
            }
        });
    }

    static async handleError(error) {
        showToast('Something went wrong')
    }
}