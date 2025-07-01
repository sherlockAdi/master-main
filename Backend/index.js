const express = require('express');
const cors = require('cors');
const { connectDB } = require('./database');

const countryRoutes = require('./routes/countryRoutes');
const stateRoutes = require('./routes/stateRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const designationRoutes = require('./routes/designationRoutes');
const cityRoutes = require('./routes/cityRoutes');
const collegeRoutes = require('./routes/collegeRoutes');
const branchRoutes = require('./routes/branchRoutes');
const localityRoutes = require('./routes/localityRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

console.log('countryRoutes:', typeof countryRoutes);
console.log('stateRoutes:', typeof stateRoutes);
console.log('departmentRoutes:', typeof departmentRoutes);
console.log('designationRoutes:', typeof designationRoutes);
console.log('cityRoutes:', typeof cityRoutes);
console.log('collegeRoutes:', typeof collegeRoutes);
console.log('branchRoutes:', typeof branchRoutes);
console.log('localityRoutes:', typeof localityRoutes);
console.log('employeeRoutes:', typeof employeeRoutes);

const app = express();
const port = process.env.PORT || 5999;

app.use(cors());
app.use(express.json());

// A simple test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// API Routes
app.use('/api/countries', countryRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/designations', designationRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/localities', localityRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/employees', employeeRoutes);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
};

startServer(); 