import axios from 'axios';



export default axios.create({

    xsrfHeaderName: 'X-CSRFToken',
    xsrfCookieName: 'csrftoken',
    headers: {
        'X-Content-Type-Options': 'nosniff',
    },

});

export const axiosPrivate = axios.create({

    headers:{
        'Content-Type': 'application/json', 
      },
      withCredentials:true,

    
});