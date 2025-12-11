// Packages
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Route files
const userRouter = require('./routes/userRoutes');

// Error Middlewares
const AppError = require('./utils/appError');
const myErrorHandler = require('./controllers/errorController');

const app = express();

// Middlewares
// 1) GLOBAL MIDDLEWARES
// Allow Access
const allowedOrigins = [
  'https://optyxenon.vercel.app',
  'https://optyxenon.com',
  'https://www.optyxenon.com',
  'http://localhost:3000',
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('====================================');
    console.log('🌍 Allowed Origins:', allowedOrigins);
    console.log('🌍 Incoming Origin:', origin);
    console.log('====================================');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ Blocked CORS request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Allow preflight

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP Address
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration'],
  }),
);

app.use(compression());

// 3) Routes
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Error: ${req.originalUrl} is not on this server`, 404));
});

app.use(myErrorHandler);

module.exports = app;
