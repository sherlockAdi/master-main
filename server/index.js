const express = require('express');
const cors = require('cors');
const { connectDB } = require('./database');

const countryRoutes = require('./routes/countryRoutes');
const stateRoutes = require('./routes/stateRoutes');
const districtRoutes = require('./routes/districtRoutes');
const tehsilRoutes = require('./routes/tehsilRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const designationRoutes = require('./routes/designationRoutes');

console.log('countryRoutes:', typeof countryRoutes);
console.log('stateRoutes:', typeof stateRoutes);
console.log('districtRoutes:', typeof districtRoutes);
console.log('tehsilRoutes:', typeof tehsilRoutes);
console.log('departmentRoutes:', typeof departmentRoutes);
console.log('designationRoutes:', typeof designationRoutes);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// A simple test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// API Routes
app.use('/api/countries', countryRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/tehsils', tehsilRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/designations', designationRoutes);

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