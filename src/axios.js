import axios from 'axios';
/*we're using axios to send a request to tmdb using the API key they gave me 
in order to get the movies */

const instance = axios.create({
    baseURL: "https://api.themoviedb.org/3"
});

export default instance;