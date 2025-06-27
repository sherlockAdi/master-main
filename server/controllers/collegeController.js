const { getDB } = require('../database');

// Get all colleges
const getAllColleges = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request().query(`
            SELECT TOP (1000) [collegename], [status], [archive], [studentprefixid], 
            [startingpoint], [id], [collegeid], [shortname], [logourl], [checkwebsite], 
            [branches], [director], [signatures], [srnstart], [oldsrnno], [pan_no], 
            [sale_tex_no], [service_tax_no], [Acc_holder_name], [ptp_account_no], 
            [SignatureImage], [Ifsc_Code], [hasaccount], [ledgerids], 
            [isforstudentdata], [collegecode], [parentid]
            FROM [beta_atmcoll1_COMM_U88].[dbo].[ATM_college]
        `);
        res.status(200).json({
            status: "success",
            message: "Colleges fetched successfully",
            data: result.recordset
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
            data: null
        });
    }
};

// Get college by ID
const getCollegeById = async (req, res) => {
    try {
        const pool = getDB();
        const result = await pool.request()
            .input('id', req.params.id)
            .query('SELECT * FROM [beta_atmcoll1_COMM_U88].[dbo].[ATM_college] WHERE id = @id');

        const college = result.recordset[0];

        if (college) {
            res.status(200).json({
                status: "success",
                message: "College fetched successfully",
                data: college
            });
        } else {
            res.status(404).json({
                status: "error",
                message: "College not found",
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

// Create a new college
const createCollege = async (req, res) => {
    try {
        const {
            collegename, status, archive, studentprefixid, startingpoint, collegeid,
            shortname, logourl, checkwebsite, branches, director, signatures, srnstart,
            oldsrnno, pan_no, sale_tex_no, service_tax_no, Acc_holder_name, ptp_account_no,
            SignatureImage, Ifsc_Code, hasaccount, ledgerids, isforstudentdata,
            collegecode, parentid
        } = req.body;

        const pool = getDB();
        await pool.request()
            .input('collegename', collegename)
            .input('status', status)
            .input('archive', archive)
            .input('studentprefixid', studentprefixid)
            .input('startingpoint', startingpoint)
            .input('collegeid', collegeid)
            .input('shortname', shortname)
            .input('logourl', logourl)
            .input('checkwebsite', checkwebsite)
            .input('branches', branches)
            .input('director', director)
            .input('signatures', signatures)
            .input('srnstart', srnstart)
            .input('oldsrnno', oldsrnno)
            .input('pan_no', pan_no)
            .input('sale_tex_no', sale_tex_no)
            .input('service_tax_no', service_tax_no)
            .input('Acc_holder_name', Acc_holder_name)
            .input('ptp_account_no', ptp_account_no)
            .input('SignatureImage', SignatureImage)
            .input('Ifsc_Code', Ifsc_Code)
            .input('hasaccount', hasaccount)
            .input('ledgerids', ledgerids)
            .input('isforstudentdata', isforstudentdata)
            .input('collegecode', collegecode)
            .input('parentid', parentid)
            .query(`
                INSERT INTO [beta_atmcoll1_COMM_U88].[dbo].[ATM_college]
                (collegename, status, archive, studentprefixid, startingpoint, collegeid, shortname, 
                logourl, checkwebsite, branches, director, signatures, srnstart, oldsrnno, pan_no, 
                sale_tex_no, service_tax_no, Acc_holder_name, ptp_account_no, SignatureImage, Ifsc_Code, 
                hasaccount, ledgerids, isforstudentdata, collegecode, parentid)
                VALUES (@collegename, @status, @archive, @studentprefixid, @startingpoint, @collegeid, 
                @shortname, @logourl, @checkwebsite, @branches, @director, @signatures, @srnstart, 
                @oldsrnno, @pan_no, @sale_tex_no, @service_tax_no, @Acc_holder_name, @ptp_account_no, 
                @SignatureImage, @Ifsc_Code, @hasaccount, @ledgerids, @isforstudentdata, 
                @collegecode, @parentid)
            `);

        res.status(201).json({
            status: "success",
            message: "College created successfully",
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

// Update college by ID
const updateCollege = async (req, res) => {
    try {
        const {
            collegename, status, archive, studentprefixid, startingpoint, collegeid,
            shortname, logourl, checkwebsite, branches, director, signatures, srnstart,
            oldsrnno, pan_no, sale_tex_no, service_tax_no, Acc_holder_name, ptp_account_no,
            SignatureImage, Ifsc_Code, hasaccount, ledgerids, isforstudentdata,
            collegecode, parentid
        } = req.body;

        const pool = getDB();
        await pool.request()
            .input('id', req.params.id)
            .input('collegename', collegename)
            .input('status', status)
            .input('archive', archive)
            .input('studentprefixid', studentprefixid)
            .input('startingpoint', startingpoint)
            .input('collegeid', collegeid)
            .input('shortname', shortname)
            .input('logourl', logourl)
            .input('checkwebsite', checkwebsite)
            .input('branches', branches)
            .input('director', director)
            .input('signatures', signatures)
            .input('srnstart', srnstart)
            .input('oldsrnno', oldsrnno)
            .input('pan_no', pan_no)
            .input('sale_tex_no', sale_tex_no)
            .input('service_tax_no', service_tax_no)
            .input('Acc_holder_name', Acc_holder_name)
            .input('ptp_account_no', ptp_account_no)
            .input('SignatureImage', SignatureImage)
            .input('Ifsc_Code', Ifsc_Code)
            .input('hasaccount', hasaccount)
            .input('ledgerids', ledgerids)
            .input('isforstudentdata', isforstudentdata)
            .input('collegecode', collegecode)
            .input('parentid', parentid)
            .query(`
                UPDATE [beta_atmcoll1_COMM_U88].[dbo].[ATM_college]
                SET collegename=@collegename, status=@status, archive=@archive,
                    studentprefixid=@studentprefixid, startingpoint=@startingpoint,
                    collegeid=@collegeid, shortname=@shortname, logourl=@logourl,
                    checkwebsite=@checkwebsite, branches=@branches, director=@director,
                    signatures=@signatures, srnstart=@srnstart, oldsrnno=@oldsrnno,
                    pan_no=@pan_no, sale_tex_no=@sale_tex_no, service_tax_no=@service_tax_no,
                    Acc_holder_name=@Acc_holder_name, ptp_account_no=@ptp_account_no,
                    SignatureImage=@SignatureImage, Ifsc_Code=@Ifsc_Code, hasaccount=@hasaccount,
                    ledgerids=@ledgerids, isforstudentdata=@isforstudentdata,
                    collegecode=@collegecode, parentid=@parentid
                WHERE id=@id
            `);

        res.status(200).json({
            status: "success",
            message: "College updated successfully",
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

// Delete college by ID
const deleteCollege = async (req, res) => {
    try {
        const pool = getDB();
        await pool.request()
            .input('id', req.params.id)
            .query('DELETE FROM [beta_atmcoll1_COMM_U88].[dbo].[ATM_college] WHERE id = @id');

        res.status(200).json({
            status: "success",
            message: "College deleted successfully",
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
    getAllColleges,
    getCollegeById,
    createCollege,
    updateCollege,
    deleteCollege
};
