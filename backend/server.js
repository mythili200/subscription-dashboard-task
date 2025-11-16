require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const plansRoutes = require('./routes/plans');
const subsRoutes = require('./routes/subscriptions');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/subscriptions', subsRoutes);

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI).then(()=>{
  app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
}).catch(err=>{ console.error('DB connect failed', err); });
