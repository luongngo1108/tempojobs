import authRoute from './authRoute.js';
import userRoute from './userRoute.js';
import workRoute from './workRoute.js';

const baseUrl = "/api"

function route(app) {
    app.use(`${baseUrl}/user`, userRoute);
    app.use(`${baseUrl}/auth`, authRoute);
    app.use(`${baseUrl}/work`, workRoute);
}

export default route;