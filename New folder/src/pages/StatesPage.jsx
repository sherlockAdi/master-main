import React, { useState, useEffect } from 'react';
import stateService from '../services/stateService';
import countryService from '../services/countryService';
import '../main.css';

const StatesPage = () => {
    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentState, setCurrentState] = useState(null);
    const [formData, setFormData] = useState({ conid: '', state: '', status: true, archive: false });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCountryId, setFilterCountryId] = useState('');

    useEffect(() => {
        loadStates();
        loadCountries();
    }, []);

    const loadStates = async () => {
        setLoading(true);
        try {
            const response = await stateService.getAllStates();
            setStates(response.data);
        } catch (error) {
            // handle error
        } finally {
            setLoading(false);
        }
    };

    const loadCountries = async () => {
        try {
            const response = await countryService.getAllCountries();
            setCountries(response.data);
        } catch (error) {
            // handle error
        }
    };

    const handleOpen = (state = null) => {
        setCurrentState(state);
        if (state) {
            setFormData({ conid: state.conid, state: state.state, status: state.status, archive: state.archive });
        } else {
            setFormData({ conid: '', state: '', status: true, archive: false });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentState(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentState) {
            await stateService.updateState(currentState.stateid, formData);
        } else {
            await stateService.createState(formData);
        }
        loadStates();
        handleClose();
    };

    const handleDelete = async (id) => {
        await stateService.deleteState(id);
        loadStates();
    };

    const getCountryName = (conid) => {
        const country = countries.find(c => c.conid === conid);
        return country ? country.country : '';
    };

    const filteredStates = states.filter(state => {
        const matchesSearch = state.state.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCountry = filterCountryId === '' || state.conid === parseInt(filterCountryId);
        return matchesSearch && matchesCountry;
    });

    return (
        <div className="page-card">
            <div className="page-header">
                <h2>States</h2>
                <button className="btn-primary" onClick={() => handleOpen()}>+ Add State</button>
            </div>

            {/* Filter Section */}
            <div className="filter-row">
                <input
                    type="text"
                    placeholder="Search by state name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-input"
                />
                <select
                    value={filterCountryId}
                    onChange={(e) => setFilterCountryId(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Countries</option>
                    {countries.map((country) => (
                        <option key={country.conid} value={country.conid}>
                            {country.country}
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
                                <th>State</th>
                                <th>Country</th>
                                <th>Status</th>
                                <th>Archive</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStates.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center' }}>
                                        No states found.
                                    </td>
                                </tr>
                            ) : (
                                filteredStates.map((state) => (
                                    <tr key={state.stateid}>
                                        <td>{state.stateid}</td>
                                        <td>{state.state}</td>
                                        <td>{getCountryName(state.conid)}</td>
                                        <td>{state.status ? 'Active' : 'Inactive'}</td>
                                        <td>{state.archive ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button className="btn-icon" onClick={() => handleOpen(state)} title="Edit">✏️</button>
                                            <button className="btn-icon" onClick={() => handleDelete(state.stateid)} title="Delete">🗑️</button>
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
                        <h3>{currentState ? 'Edit State' : 'Add State'}</h3>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <label>
                                State Name
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Country
                                <select
                                    name="conid"
                                    value={formData.conid}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Country</option>
                                    {countries.map((country) => (
                                        <option key={country.conid} value={country.conid}>
                                            {country.country}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <div className="form-row">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="status"
                                        checked={formData.status}
                                        onChange={handleChange}
                                    /> Active
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="archive"
                                        checked={formData.archive}
                                        onChange={handleChange}
                                    /> Archive
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

export default StatesPage;
