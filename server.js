import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { UserRouter } from './Routes/userRoutes.js'
dotenv.config()

const app = express()
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDB = async () => {
  const dbURI = process.env.MONGODB_URL_COMPASS

  try {
    await mongoose.connect(dbURI, {
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error while connecting to DB:', error);
    process.exit(1);
  }
};

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: 'GET,POST,PUT,DELETE'
}));

app.use(cookieParser());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
  }
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', UserRouter)

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch((error) => {
  console.error('Failed to connect to MongoDB:', error);
});