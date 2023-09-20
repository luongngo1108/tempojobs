import authRoute from './authRoute.js';
import userRoute from './userRoute.js';
const baseUrl = "/api/v1"

function route(app) {
    app.use(`${baseUrl}/user`, userRoute);
    app.use(`${baseUrl}/auth`, authRoute);
}

export default route;