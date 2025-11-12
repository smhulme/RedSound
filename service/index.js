const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const { ObjectId } = require('mongodb');
const app = express();
const DB = require('./database.js'); // <-- Import the new database module

const authCookieName = 'token';

const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints 
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// POST /api/auth/create: Register a new user
apiRouter.post('/auth/create', async (req, res) => {
  const { username, password } = req.body;

  if (await DB.getUser(username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(username, password);
    setAuthCookie(res, user.token);
    res.send({ username: user.username });
  }
});

// POST /api/auth/login: Login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await DB.getUser(username);

  if (user) {
    // Check if the password matches the stored hash
    if (await bcrypt.compare(password, user.password)) {
      // Generate and store a new token
      const newToken = uuid.v4();
      await DB.updateUserToken(user._id, newToken);

      setAuthCookie(res, newToken);
      res.send({ username: user.username });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DELETE /api/auth/logout: Logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (user) {
    // Clear the token in the database
    await DB.updateUserToken(user._id, null);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await DB.getUserByToken(req.cookies[authCookieName]);
  if (user) {
    req.user = user; // Attach user data to request
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// GET /api/user/me: Get current authenticated user details
apiRouter.get('/user/me', verifyAuth, (req, res) => {
  // The username is attached to req.user by verifyAuth
  res.send({ username: req.user.username });
});

// POST /api/booking: Submit a new booking
apiRouter.post('/booking', async (req, res) => {
  const bookingData = {
    ...req.body,
    timestamp: new Date()
  };

  try {
    const result = await DB.addBooking(bookingData);
    console.log(`New booking saved with id ${result.insertedId}`);
    res.status(201).send({ msg: 'Booking confirmed', bookingId: result.insertedId });
  } catch (error) {
    console.error('Failed to save booking:', error);
    res.status(500).send({ msg: 'Failed to save booking' });
  }
});

// GET /api/bookings: Get all bookings (employee dashboard)
apiRouter.get('/bookings', verifyAuth, async (req, res) => {
  try {
    const bookings = await DB.getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    res.status(500).send({ msg: 'Failed to fetch bookings' });
  }
});

// DELETE /api/bookings/:id (requires authentication)
apiRouter.delete('/bookings/:id', verifyAuth, async (req, res) => {
  try {
    const result = await DB.deleteBooking(req.params.id);
    if (result.deletedCount === 1) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ msg: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).send({ msg: 'Failed to delete booking' });
  }
});

// FALLBACK & ERROR HANDLERS

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown (client-side routing)
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production', // Only secure in prod
    httpOnly: true, // Not accessible via client-side JS
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});