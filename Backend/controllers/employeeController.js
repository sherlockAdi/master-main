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
        // Insert all fields except id
        const fields = [
            'firstname', 'lastname', 'department', 'designation', 'employeecode', 'gender', 'officelandline', 'dateofjoining', 'dateofbirth', 'mailaddress', 'street', 'cityname', 'statename', 'permanentaddress', 'pincode', 'dateofanniversary', 'homephone', 'mobileno', 'officeemail', 'personalemail', 'bloodgroup', 'status', 'archive', 'image', 'idproof', 'cheque1', 'cheque1bankname', 'cheque1date', 'cheque2', 'cheque2bankname', 'cheque2date', 'countryname', 'punchcode', 'isactive', 'resume', 'updatedate', 'isupdated', 'typeofemp', 'IsWaiver', 'roleid', 'prefix', 'scancopy', 'scancopy2', 'isfinal', 'panno', 'isaccept', 'isauthorizedsignatory', 'isfaculty', 'extensionno', 'officialno', 'AccountNo', 'infavouroff', 'IFSCCode', 'bankname', 'bankbranch', 'companyname', 'branch', 'sugession_and_prob', 'showinsalary', 'ismeterchecker', 'iscashpaid', 'isbackDate_leaveallowed', 'islocked', 'dateOfRelieving', 'teamleader', 'byteimage', 'userblockDate', 'fathername', 'mothername', 'ismanualpunchAllowed', 'salary', 'DocUploaded', 'Remindercounter', 'logindate', 'fine', 'Project', 'ViewAttendanceTimeFrom', 'ViewAttendanceHour', 'ViewAttendanceDate', 'ESIStatus', 'PFStatus', 'TDSStatus', 'DeviceId', 'pwd', 'rollid', 'leavetypeid', 'WFHType', 'Joblocation', 'jobbranch', 'BankID', 'AccountId', 'AccountStatus', 'ESINumber', 'PFNumber', 'CostCenter', 'ModeofPayment', 'Pervocrate', 'MaxDay', 'fineperdate', 'Maxfine'
        ];
        const pool = getDB();
        let request = pool.request();
        fields.forEach(field => {
            let value = req.body[field];
            if (field === 'byteimage') {
                if (typeof value !== 'string') value = null;
            }
            request = request.input(field, value);
        });
        await request.query(`INSERT INTO [beta_ATM_COMM_U88].[dbo].[Atm_M_Employee88]
            (${fields.join(', ')})
            VALUES (${fields.map(f => '@' + f).join(', ')})`);
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
        const pool = getDB();
        let request = pool.request();
        request = request.input('id', req.params.id);

        // Only update fields present in req.body (except id and file/image fields)
        const fileFields = ['image', 'byteimage', 'idproof', 'resume', 'scancopy', 'scancopy2', 'pancard'];
        const fields = Object.keys(req.body).filter(f => f !== 'id' && !fileFields.includes(f));
        if (fields.length === 0) {
            return res.status(400).json({ status: "error", message: "No fields to update", data: null });
        }
        const setClause = fields.map(f => `${f}=@${f}`).join(', ');
        fields.forEach(field => {
            let value = req.body[field];
            request = request.input(field, value);
        });
        await request.query(`UPDATE [beta_ATM_COMM_U88].[dbo].[Atm_M_Employee88]
            SET ${setClause}
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