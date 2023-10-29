import authRoute from './authRoute.js';
import userRoute from './userRoute.js';
import workRoute from './workRoute.js';
import dataStateRoute from './dataStateRoute.js';
import locationRoute from './locationRoute.js';
import paymentRoute from './paymentRoute.js';

const baseUrl = "/api"

function route(app) {
    app.use(`${baseUrl}/user`, userRoute);
    app.use(`${baseUrl}/auth`, authRoute);
    app.use(`${baseUrl}/work`, workRoute);
    app.use(`${baseUrl}/dataState`, dataStateRoute);
    app.use(`${baseUrl}/location`, locationRoute);
    app.use(`${baseUrl}/payment`, paymentRoute);
}
export default route;