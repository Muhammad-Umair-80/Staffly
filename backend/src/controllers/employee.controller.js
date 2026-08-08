const employee = require('../models/employee.model');


async function saveEmployee(req, res) {
    try {
        const newEmployee = new employee(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        console.error('Error saving employee:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = { saveEmployee };