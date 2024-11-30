const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login Page' }); 
  });

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Received username:', username); 
    console.log('Received password:', password); 
    
    try {
      const user = await User.findOne({ username });
      if (!user) {
        console.log('User not found');
        return res.status(401).send('Invalid username or password');
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password does not match');
        return res.status(401).send('Invalid username or password');
      }
  
      console.log('Login successful');
      req.session.userId = user._id;
      res.redirect('/employees'); 
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error');
    }
  });
  


  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Could not log out');
      }
      res.redirect('/login');
    });
  });

module.exports = router;
