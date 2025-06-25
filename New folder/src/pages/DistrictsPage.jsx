import React, { useState, useEffect } from 'react';
import districtService from '../services/districtService';
import stateService from '../services/stateService';
import '../main.css';

const DistrictsPage = () => {
    const [districts, setDistricts] = useState([]);
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentDistrict, setCurrentDistrict] = useState(null);
    const [formData, setFormData] = useState({ district_name: '', stateid: '', status: true, archive: false });

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStateFilter, setSelectedStateFilter] = useState('');

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [distResponse, stateResponse] = await Promise.all([
                districtService.getAllDistricts(),
                stateService.getAllStates()
            ]);
            setDistricts(distResponse.data);
            setStates(stateResponse.data);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadDistricts = async () => {
        const response = await districtService.getAllDistricts();
        setDistricts(response.data);
    };

    const handleOpen = (district = null) => {
        setCurrentDistrict(district);
        if (district) {
            setFormData({
                district_name: district.district_name,
                stateid: district.stateid,
                status: !!district.status,
                archive: !!district.archive
            });
        } else {
            setFormData({ district_name: '', stateid: '', status: true, archive: false });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentDistrict(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentDistrict) {
            await districtService.updateDistrict(currentDistrict.district_id, formData);
        } else {
            await districtService.createDistrict(formData);
        }
        loadDistricts();
        handleClose();
    };

    const handleDelete = async (id) => {
        await districtService.deleteDistrict(id);
        loadDistricts();
    };

    const getStateName = (stateid) => {
        const state = states.find(s => String(s.stateid) === String(stateid));
        return state ? state.state : 'N/A';
    };

    const filteredDistricts = districts.filter(d =>
        d.district_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedStateFilter ? d.stateid === selectedStateFilter : true)
    );

    return (
        <div className="page-card industrial-theme">
            <div className="page-header">
                <h2>Districts</h2>
                <button className="btn-primary" onClick={() => handleOpen()}>+ Add District</button>
            </div>

            {/* Filters */}
            <div className="filter-row">
                <input
                    type="text"
                    placeholder="Search by district name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-input"
                />
                <select
                    value={selectedStateFilter}
                    onChange={(e) => setSelectedStateFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="">Filter by State</option>
                    {states.map(state => (
                        <option key={state.stateid} value={state.stateid}>
                            {state.state}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="loader">Loading...</div>
            ) : (
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>District Name</th>
                                <th>State</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDistricts.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: 'center' }}>No districts found.</td></tr>
                            ) : (
                                filteredDistricts.map((district) => (
                                    <tr key={district.district_id}>
                                        <td>{district.district_id}</td>
                                        <td>{district.district_name}</td>
                                        <td>{getStateName(district.stateid)}</td>
                                        <td>{district.status ? 'Active' : 'Inactive'}</td>
                                        <td>
                                            <button className="btn-icon" onClick={() => handleOpen(district)} title="Edit">✏️</button>
                                            <button className="btn-icon" onClick={() => handleDelete(district.district_id)} title="Delete">🗑️</button>
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
                        <h3>{currentDistrict ? 'Edit District' : 'Add District'}</h3>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <label>
                                District Name
                                <input
                                    type="text"
                                    name="district_name"
                                    value={formData.district_name}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                State (Searchable)
                                <input
                                    type="text"
                                    placeholder="Search State..."
                                    onChange={(e) => {
                                        const search = e.target.value.toLowerCase();
                                        setStates(prev => [...prev]); // trigger re-render
                                        document.querySelectorAll('.state-options option').forEach(opt => {
                                            opt.hidden = !opt.textContent.toLowerCase().includes(search);
                                        });
                                    }}
                                    className="filter-input"
                                />
                                <select
                                    name="stateid"
                                    value={formData.stateid}
                                    onChange={handleChange}
                                    required
                                    className="state-options"
                                >
                                    <option value="">Select State</option>
                                    {states.map(state => (
                                        <option key={state.stateid} value={state.stateid}>
                                            {state.state}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <div className="form-row">
                                <label>
                                    <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />
                                    Active
                                </label>
                                <label>
                                    <input type="checkbox" name="archive" checked={formData.archive} onChange={handleChange} />
                                    Archive
                                </label>
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

export default DistrictsPage;
