import express, { json } from 'express';
import 'dotenv/config';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
import route from './src/routes/indexRoutes.js';
import connect from './src/configs/dbConnection.js';
import { outDateWork } from './src/cronJobs/workJobs.js';

//database connection
connect();

//middleware
app.use(json());
app.use(cors());

//base route
route(app);

// cron jobs
outDateWork.start();

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
})
