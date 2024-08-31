import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/Routes';
import connectDb from './db/MongoClient';

const app = express();
const port = 3000;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);

connectDb().then(() => {
  app.listen(port, () => {
    console.log('Server is running on port 3000');
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB and start server:', err);
});