import React, { useState, useEffect } from 'react';
import countryService from '../services/countryService';
import stateService from '../services/stateService';
import '../main.css';

const CountriesPage = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [currentCountry, setCurrentCountry] = useState(null);
    const [formData, setFormData] = useState({ country: '', status: true, archive: false });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const countryRes = await countryService.getAllCountries();
            const stateRes = await stateService.getAllStates();
            setCountries(countryRes.data);
            setStates(stateRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = (country = null) => {
        setCurrentCountry(country);
        if (country) {
            setFormData({ country: country.country, status: country.status, archive: country.archive });
        } else {
            setFormData({ country: '', status: true, archive: false });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentCountry(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentCountry) {
            await countryService.updateCountry(currentCountry.conid, formData);
        } else {
            await countryService.createCountry(formData);
        }
        loadData();
        handleClose();
    };

    const handleDelete = async (id) => {
        await countryService.deleteCountry(id);
        loadData();
    };

    const hasStates = (conid) => {
        return states.some(s => s.conid === conid);
    };

    const filteredCountries = countries.filter(c =>
        c.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-card industrial-theme">
            <div className="page-header">
                <h2>Countries</h2>
                <button className="btn-primary" onClick={() => handleOpen()}>+ Add Country</button>
            </div>

            <div className="filter-row">
                <input
                    type="text"
                    placeholder="Search by country name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-input"
                />
            </div>

            {loading ? (
                <div className="loader">Loading...</div>
            ) : (
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Country</th>
                                <th>State Count</th>
                                <th>Status</th>
                                <th>Archive</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCountries.length === 0 ? (
                                <tr><td colSpan={6} style={{ textAlign: 'center' }}>No countries found.</td></tr>
                            ) : (
                                filteredCountries.map((country) => {
                                    const disabled = hasStates(country.conid);
                                    const stateCount = states.filter(s => s.conid === country.conid).length;

                                    return (
                                        <tr key={country.conid}>
                                            <td>{country.conid}</td>
                                            <td>{country.country}</td>
                                            <td>{stateCount}</td>
                                            <td>{country.status ? 'Active' : 'Inactive'}</td>
                                            <td>{country.archive ? 'Yes' : 'No'}</td>
                                            <td>
                                                <button
                                                    className="btn-icon"
                                                    onClick={() => handleOpen(country)}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn-icon"
                                                    onClick={() => !disabled && handleDelete(country.conid)}
                                                    disabled={disabled}
                                                    title={disabled ? 'Cannot delete - country has linked states' : 'Delete'}
                                                    style={{
                                                        cursor: disabled ? 'not-allowed' : 'pointer',
                                                        opacity: disabled ? 0.4 : 1
                                                    }}
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>

                    </table>
                </div>
            )}

            {open && (
                <div className="modal-overlay" onClick={handleClose}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>{currentCountry ? 'Edit Country' : 'Add Country'}</h3>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <label>
                                Country Name
                                <input type="text" name="country" value={formData.country} onChange={handleChange} required />
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

export default CountriesPage;
