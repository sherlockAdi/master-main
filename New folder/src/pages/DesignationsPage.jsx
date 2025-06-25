import React, { useState, useEffect } from 'react';
import designationService from '../services/designationService';
import departmentService from '../services/departmentService';
import '../main.css';

const DesignationsPage = () => {
    const [designations, setDesignations] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentDesignation, setCurrentDesignation] = useState(null);
    const [formData, setFormData] = useState({
        Desgname: '', shortname: '', departmentid: '', status: true, archive: false, gradeid: ''
    });

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [desResponse, deptResponse] = await Promise.all([
                designationService.getAllDesignations(),
                departmentService.getAllDepartments()
            ]);
            setDesignations(desResponse.data);
            setDepartments(deptResponse.data);
        } catch (error) {
            // handle error
        } finally {
            setLoading(false);
        }
    };

    const loadDesignations = async () => {
        const response = await designationService.getAllDesignations();
        setDesignations(response.data);
    };

    const handleOpen = (designation = null) => {
        setCurrentDesignation(designation);
        if (designation) {
            setFormData({
                Desgname: designation.Desgname || '',
                shortname: designation.shortname || '',
                departmentid: designation.departmentid || '',
                status: !!designation.status,
                archive: !!designation.archive,
                gradeid: designation.gradeid || ''
            });
        } else {
            setFormData({
                Desgname: '', shortname: '', departmentid: '', status: true, archive: false, gradeid: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentDesignation(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentDesignation) {
            await designationService.updateDesignation(currentDesignation.id, formData);
        } else {
            await designationService.createDesignation(formData);
        }
        loadDesignations();
        handleClose();
    };

    const handleDelete = async (id) => {
        await designationService.deleteDesignation(id);
        loadDesignations();
    };

    const getDepartmentName = (departmentid) => {
        const department = departments.find(d => d.id === departmentid);
        return department ? department.DeptName : 'N/A';
    };

    return (
        <div className="page-card">
            <div className="page-header">
                <h2>Designations</h2>
                <button className="btn-primary" onClick={() => handleOpen()}>+ Add Designation</button>
            </div>
            {loading ? (
                <div className="loader">Loading...</div>
            ) : (
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {designations.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center' }}>No designations found.</td></tr>
                            ) : (
                                designations.map((designation) => (
                                    <tr key={designation.id}>
                                        <td>{designation.id}</td>
                                        <td>{designation.Desgname}</td>
                                        <td>{getDepartmentName(designation.departmentid)}</td>
                                        <td>{designation.status ? 'Active' : 'Inactive'}</td>
                                        <td>
                                            <button className="btn-icon" onClick={() => handleOpen(designation)} title="Edit">✏️</button>
                                            <button className="btn-icon" onClick={() => handleDelete(designation.id)} title="Delete">🗑️</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {open && (
                <div className="modal-overlay" onClick={handleClose}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>{currentDesignation ? 'Edit Designation' : 'Add Designation'}</h3>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <label>
                                Designation Name
                                <input type="text" name="Desgname" value={formData.Desgname} onChange={handleChange} required />
                            </label>
                            <label>
                                Department
                                <select name="departmentid" value={formData.departmentid} onChange={handleChange} required>
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.DeptName}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Short Name
                                <input type="text" name="shortname" value={formData.shortname} onChange={handleChange} />
                            </label>
                            <label>
                                Grade ID
                                <input type="text" name="gradeid" value={formData.gradeid} onChange={handleChange} />
                            </label>
                            <div className="form-row">
                                <label><input type="checkbox" name="status" checked={formData.status} onChange={handleChange} /> Active</label>
                                <label><input type="checkbox" name="archive" checked={formData.archive} onChange={handleChange} /> Archive</label>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={handleClose}>Cancel</button>
                                <button type="submit" className="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DesignationsPage; 