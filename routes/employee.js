const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/login');
}

router.get('/', isAuthenticated, async (req, res) => {
  try {
   
    const employees = await Employee.find().lean();
    res.render('dashboard', { employees });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching employees');
  }
});

router.get("/add", (req, res) => {
  res.render("addEmployee");
});


router.post("/add", async (req, res) => {
  try {
    const { name, email, position, salary } = req.body;

    await Employee.create({ name, email, position, salary });

   
    res.redirect("/employees");
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/search", async (req, res) => {
  const query = req.query.query;

  try {
    const employees = await Employee.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { position: { $regex: query, $options: "i" } },
      ],
    });

    res.render("dashboard", { employees });
  } catch (error) {
    console.error("Error searching employees:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/update/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).lean();
    console.log('Employee fetched for update:', employee); 
    if (!employee) {
      return res.status(404).send('Employee not found');
    }
    res.render('update', { employee });
  } catch (error) {
    console.error('Error fetching employee details:', error);
    res.status(500).send('Error fetching employee details');
  }
});

router.post('/update/:id', async (req, res) => {
  console.log('Form data received:', req.body);

  const { name, email, position, salary } = req.body;

  if (!name || !email || !position || !salary) {
    console.error('Missing required fields:', req.body); 
    return res.status(400).send('Missing required fields');
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, position, salary },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).send('Employee not found');
    }

    console.log('Updated employee:', updatedEmployee); 
    res.redirect('/employees');
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).send('Error updating employee');
  }
});

router.post('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id); 
    res.redirect('/employees'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting employee');
  }
});

module.exports = router;
