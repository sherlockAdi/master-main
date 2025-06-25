import React, { useState, useEffect } from 'react';
import departmentService from '../services/departmentService';
import '../main.css';

console.log('hello world');

const DepartmentsPage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState(null);
    const [formData, setFormData] = useState({
        DeptName: '', shortname: '', status: true, archive: false, showonwebsite: false, aboutdeptt: ''
    });

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        setLoading(true);
        try {
            const response = await departmentService.getAllDepartments();
            setDepartments(response.data);
        } catch (error) {
            // handle error
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (department = null) => {
        setCurrentDepartment(department);
        if (department) {
            setFormData({
                DeptName: department.DeptName || '',
                shortname: department.shortname || '',
                status: !!department.status,
                archive: !!department.archive,
                showonwebsite: !!department.showonwebsite,
                aboutdeptt: department.aboutdeptt || ''
            });
        } else {
            setFormData({
                DeptName: '', shortname: '', status: true, archive: false, showonwebsite: false, aboutdeptt: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentDepartment(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentDepartment) {
            await departmentService.updateDepartment(currentDepartment.id, formData);
        } else {
            await departmentService.createDepartment(formData);
        }
        loadDepartments();
        handleClose();
    };

    const handleDelete = async (id) => {
        await departmentService.deleteDepartment(id);
        loadDepartments();
    };

    return (
        <div className="page-card">
            <div className="page-header">
                <h2>Departments</h2>
                <button className="btn-primary" onClick={() => handleOpen()}>+ Add Department</button>
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
                                <th>Short Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center' }}>No departments found.</td></tr>
                            ) : (
                                departments.map((department) => (
                                    <tr key={department.id}>
                                        <td>{department.id}</td>
                                        <td>{department.DeptName}</td>
                                        <td>{department.shortname}</td>
                                        <td>{department.status ? 'Active' : 'Inactive'}</td>
                                        <td>
                                            <button className="btn-icon" onClick={() => handleOpen(department)} title="Edit">✏️</button>
                                            <button className="btn-icon" onClick={() => handleDelete(department.id)} title="Delete">🗑️</button>
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
                        <h3>{currentDepartment ? 'Edit Department' : 'Add Department'}</h3>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <label>
                                Department Name
                                <input type="text" name="DeptName" value={formData.DeptName} onChange={handleChange} required />
                            </label>
                            <label>
                                Short Name
                                <input type="text" name="shortname" value={formData.shortname} onChange={handleChange} />
                            </label>
                            <label>
                                About Department
                                <textarea name="aboutdeptt" value={formData.aboutdeptt} onChange={handleChange} rows={2} />
                            </label>
                            <div className="form-row">
                                <label><input type="checkbox" name="status" checked={formData.status} onChange={handleChange} /> Active</label>
                                <label><input type="checkbox" name="archive" checked={formData.archive} onChange={handleChange} /> Archive</label>
                                <label><input type="checkbox" name="showonwebsite" checked={formData.showonwebsite} onChange={handleChange} /> Show on Website</label>
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

export default DepartmentsPage; 