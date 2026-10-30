const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const panelRoutes = require('./routes');

const app = express();

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'drake_secure_session_key_999',
  resave: false,
  saveUninitialized: true
}));

// Load all routes
app.use('/', panelRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Drake Panel running on port ${PORT}`);
});
