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
}