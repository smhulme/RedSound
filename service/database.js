const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const config = require('./dbConfig.json');

// Build the connection string from your config
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}/?retryWrites=true&w=majority`;
const client = new MongoClient(url);
let db;
let usersCollection;
let bookingsCollection;

// This will asynchronously test the connection and exit the process if it fails
(async function connectToDb() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('RedSound'); // Use a database named 'RedSound'
    usersCollection = db.collection('users');
    bookingsCollection = db.collection('bookings');
  } catch (ex) {
    console.error(`Failed to connect to MongoDB: ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(username) {
  return usersCollection.findOne({ username: username });
}

function getUserByToken(token) {
  return usersCollection.findOne({ token: token });
}

async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
  };
  await usersCollection.insertOne(user);
  return user;
}

async function updateUserToken(userId, token) {
  if (token) {
    // Set a new token
    await usersCollection.updateOne({ _id: userId }, { $set: { token: token } });
  } else {
    // Remove the token (on logout)
    await usersCollection.updateOne({ _id: userId }, { $unset: { token: '' } });
  }
}

async function addBooking(bookingData) {
  const result = await bookingsCollection.insertOne(bookingData);
  return result;
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  updateUserToken,
  addBooking,
};