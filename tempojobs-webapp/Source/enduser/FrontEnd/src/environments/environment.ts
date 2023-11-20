export const host = 'http://localhost:5000';
export const apiUrl = `${host}/api`;

export const environment = {
    production: true,
    host,
    apiUrl,
    apiWorkManagement: apiUrl + '/work',
    apiAuth: apiUrl + '/auth',
    apiUser: apiUrl + '/user',
    apiLocation: apiUrl + '/location',
    apiDataStateManagement: apiUrl + '/dataState',
    apiPayment: apiUrl + '/payment',
    apiReport: apiUrl + '/report',
    apiNotification: apiUrl + '/notification',
    firebaseConfig: {
        apiKey: "AIzaSyAXH_vK2MTTNdigQsi1PvhPyl5pu5-Y9Ek",
        authDomain: "tempojob2nd.firebaseapp.com",
        projectId: "tempojob2nd",
        storageBucket: "tempojob2nd.appspot.com",
        messagingSenderId: "696657954225",
        appId: "1:696657954225:web:0c37a1fe57566b088ea990",
        measurementId: "G-PGL3CLZ03G"
    }
}