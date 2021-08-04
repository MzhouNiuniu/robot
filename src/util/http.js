import axios from 'axios';
const http = axios.create();
export default {
    default: axios,
    get(url, data,) {
        return http({
            url,
            method: 'get',
            params: data,
        }).then(res => {
            return res.data;
        });
    },
    post() {
        return http.post(...arguments).then(res => {
            return res.data;
        });
    },



};
