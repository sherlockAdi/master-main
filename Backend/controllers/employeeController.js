const { getDB } = require('../database');

// Get all employees with pagination and filters
const getAllEmployees = async (req, res) => {
    try {
        const pool = getDB();
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;
        const { department, designation, employeecode, status, search } = req.query;

        let filterQuery = '';
        if (department) filterQuery += ` AND department = '${department}'`;
        if (designation) filterQuery += ` AND designation = '${designation}'`;
        if (employeecode) filterQuery += ` AND employeecode = '${employeecode}'`;
        if (status) filterQuery += ` AND status = '${status}'`;
        if (search) {
            const safeSearch = search.replace(/'/g, "''");
            filterQuery += ` AND (LOWER(firstname) LIKE '%${safeSearch.toLowerCase()}%' OR LOWER(lastname) LIKE '%${safeSearch.toLowerCase()}%' OR LOWER(employeecode) LIKE '%${safeSearch.toLowerCase()}%')`;
        }

        const query = `
            SELECT * FROM [beta_ATM_COMM_U88].[dbo].[Atm_M_Employee88]
            WHERE 1=1 ${filterQuery}
            ORDER BY id OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY;
            SELECT COUNT(*) as total FROM [beta_ATM_COMM_U88].[dbo].[Atm_M_Employee88] WHERE 1=1 ${filterQuery};
        `;
        const result = await pool.request().query(query);
        res.status(200).json({
            status: "success",
            message: "Employees fetched successfully",
            data: result.recordsets[0],
            total: result.recordsets[1][0].total
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
            data: null
        });
    }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('id', req.params.id)
            .query('SELECT * FROM [beta_ATM_COMM_U88].[dbo].[Atm_M_Employee88] WHERE id = @id');
        const employee = result.recordset[0];
        if (employee) {
            res.status(200).json({
                status: "success",
                message: "Employee fetched successfully",
                data: employee
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "Employee not found",
                data: null
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
            data: null
        });
    }
};

// Create a new employee
const createEmployee = async (req, res) => {
    try {
        // For brevity, insert only a few fields. Expand as needed.
        const { firstname, lastname, department, designation, employeecode, officeemail, mobileno, status } = req.body;
        const pool = getDB();
        await pool.request()
            .input('firstname', firstname)
            .input('lastname', lastname)
            .input('department', department)
            .input('designation', designation)
            .input('employeecode', employeecode)
            .input('officeemail', officeemail)
            .input('mobileno', mobileno)
            .input('status', status)
            .query(`INSERT INTO [beta_ATM_COMM_U88].[dbo].[Atm_M_Employee88]
                (firstname, lastname, department, designation, employeecode, officeemail, mobileno, status)
                VALUES (@firstname, @lastname, @department, @designation, @employeecode, @officeemail, @mobileno, @status)`);
        res.status(201).json({
            status: "success",
            message: "Employee created successfully",
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
            data: null
        });
    }
};

// Update employee by ID
const updateEmployee = async (req, res) => {
    try {
        const { firstname, lastname, department, designation, employeecode, officeemail, mobileno, status } = req.body;
        const pool = getDB();
        await pool.request()
            .input('id', req.params.id)
            .input('firstname', firstname)
            .input('lastname', lastname)
            .input('department', department)
            .input('designation', designation)
            .input('employeecode', employeecode)
            .input('officeemail', officeemail)
            .input('mobileno', mobileno)
            .input('status', status)
            .query(`UPDATE [beta_ATM_COMM_U88].[dbo].[Atm_M_Employee88]
                SET firstname=@firstname, lastname=@lastname, department=@department, designation=@designation, employeecode=@employeecode, officeemail=@officeemail, mobileno=@mobileno, status=@status
                WHERE id=@id`);
        res.status(200).json({
            status: "success",
            message: "Employee updated successfully",
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
            data: null
        });
    }
};

// Delete employee by ID
const deleteEmployee = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('id', req.params.id)
            .query('DELETE FROM [beta_ATM_COMM_U88].[dbo].[Atm_M_Employee88] WHERE id = @id');
        res.status(200).json({
            status: "success",
            message: "Employee deleted successfully",
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
            data: null
        });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
}; 