import React, { useState, useEffect } from 'react';
import tehsilService from '../services/tehsilService';
import districtService from '../services/districtService';
import '../main.css';

const TehsilsPage = () => {
    const [tehsils, setTehsils] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentTehsil, setCurrentTehsil] = useState(null);
    const [formData, setFormData] = useState({ tehsil_name: '', district_id: '', status: true, archive: false });

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [tehsilResponse, distResponse] = await Promise.all([
                tehsilService.getAllTehsils(),
                districtService.getAllDistricts()
            ]);
            setTehsils(tehsilResponse.data);
            setDistricts(distResponse.data);
        } catch (error) {
            // handle error
        } finally {
            setLoading(false);
        }
    };

    const loadTehsils = async () => {
        const response = await tehsilService.getAllTehsils();
        setTehsils(response.data);
    };

    const handleOpen = (tehsil = null) => {
        setCurrentTehsil(tehsil);
        if (tehsil) {
            setFormData({ tehsil_name: tehsil.tehsil_name, district_id: tehsil.district_id, status: !!tehsil.status, archive: !!tehsil.archive });
        } else {
            setFormData({ tehsil_name: '', district_id: '', status: true, archive: false });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentTehsil(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentTehsil) {
            await tehsilService.updateTehsil(currentTehsil.tehsil_id, formData);
        } else {
            await tehsilService.createTehsil(formData);
        }
        loadTehsils();
        handleClose();
    };

    const handleDelete = async (id) => {
        await tehsilService.deleteTehsil(id);
        loadTehsils();
    };
    
    const getDistrictName = (district_id) => {
        const district = districts.find(d => d.district_id === district_id);
        return district ? district.district_name : 'N/A';
    };

    return (
        <div className="page-card">
            <div className="page-header">
                <h2>Tehsils</h2>
                <button className="btn-primary" onClick={() => handleOpen()}>+ Add Tehsil</button>
            </div>
            {loading ? (
                <div className="loader">Loading...</div>
            ) : (
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tehsil Name</th>
                                <th>District</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tehsils.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center' }}>No tehsils found.</td></tr>
                            ) : (
                                tehsils.map((tehsil) => (
                                    <tr key={tehsil.tehsil_id}>
                                        <td>{tehsil.tehsil_id}</td>
                                        <td>{tehsil.tehsil_name}</td>
                                        <td>{getDistrictName(tehsil.district_id)}</td>
                                        <td>{tehsil.status ? 'Active' : 'Inactive'}</td>
                                        <td>
                                            <button className="btn-icon" onClick={() => handleOpen(tehsil)} title="Edit">✏️</button>
                                            <button className="btn-icon" onClick={() => handleDelete(tehsil.tehsil_id)} title="Delete">🗑️</button>
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
                        <h3>{currentTehsil ? 'Edit Tehsil' : 'Add Tehsil'}</h3>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <label>
                                Tehsil Name
                                <input type="text" name="tehsil_name" value={formData.tehsil_name} onChange={handleChange} required />
                            </label>
                            <label>
                                District
                                <select name="district_id" value={formData.district_id} onChange={handleChange} required>
                                    <option value="">Select District</option>
                                    {districts.map(district => (
                                        <option key={district.district_id} value={district.district_id}>{district.district_name}</option>
                                    ))}
                                </select>
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

export default TehsilsPage; 