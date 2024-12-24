import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './config/db.js';
import cors from 'cors';
import paymentRoute from './routes/payment.router.js';

// middleware
app.use(express.json());
app.use(cors());

app.use('/api/v1/payments',paymentRoute)

const PORT = process.env.PORT || 8000 ;
app.listen(PORT, () => {
    connectDb();
    console.log(`Server Running on port ${PORT}`);
  });