import axios from 'axios';

const URL_NAME = 'http//localhost:3500';

export default axios.create({
    baseURL: URL_NAME,
    xsrfHeaderName: 'X-CSRFToken',
    xsrfCookieName: 'csrftoken',
});

export const axiosPrivate = axios.create({
    baseURL: URL_NAME,
    headers:{
        'Content-Type': 'application/json', 
      },
      withCredentials:true,

    
});