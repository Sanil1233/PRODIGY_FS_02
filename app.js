require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const hbs = require('hbs');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const app = express();

mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on('connected', () => console.log('MongoDB connected'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(path.join(__dirname, 'views/partials'));

const exphbs = require('express-handlebars');
const hbs1 = exphbs.create({
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(require('handlebars')), 
});

app.engine('handlebars', hbs1.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/', authRoutes);
app.use('/employees', employeeRoutes);
app.get('/', (req, res) => {
  res.redirect('/login');
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
