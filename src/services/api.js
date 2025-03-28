import axios from 'axios';

var url = "https://api.nytimes.com/svc/books/v3";

const api = axios.create({
    baseURL: url,
});

export default api;