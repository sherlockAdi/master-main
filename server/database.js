const mssql = require('mssql');

const dbConfig = {
    user: 'betauser',
    password: 'Atm@12_34@56',
    server: '61.246.33.108',
    port: 5638,
    database: 'beta_atmcoll1_COMM_U88',
    options: {
        encrypt: false, // Use true for Azure SQL Database, or if you have an SSL certificate
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

let pool;

const connectDB = async () => {
    try {
        if (pool) {
            return pool;
        }
        pool = await mssql.connect(dbConfig);
        console.log('Connected to MSSQL');
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err);
        // Terminate the application if the database connection fails
        process.exit(1);
    }
};

const getDB = () => {
    if (!pool) {
        throw new Error('Database not connected. Call connectDB first.');
    }
    return pool;
};

module.exports = { connectDB, getDB }; 