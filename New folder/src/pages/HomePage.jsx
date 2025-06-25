import React, { useEffect, useState } from 'react';
import departmentService from '../services/departmentService';
import designationService from '../services/designationService';
import countryService from '../services/countryService';
import stateService from '../services/stateService';
import districtService from '../services/districtService';
import tehsilService from '../services/tehsilService';
import '../main.css';

const entityMeta = [
  { key: 'departments', label: 'Departments', icon: '🏛️', color: '#1976d2' },
  { key: 'designations', label: 'Designations', icon: '👔', color: '#42a5f5' },
  { key: 'countries', label: 'Countries', icon: '🌍', color: '#43a047' },
  { key: 'states', label: 'States', icon: '🗺️', color: '#fbc02d' },
  { key: 'districts', label: 'Districts', icon: '🏢', color: '#8e24aa' },
  { key: 'tehsils', label: 'Tehsils', icon: '🏞️', color: '#ff7043' },
];

const HomePage = () => {
  const [data, setData] = useState({
    departments: [],
    designations: [],
    countries: [],
    states: [],
    districts: [],
    tehsils: [],
  });
  const [loading, setLoading] = useState(true);
  const [openList, setOpenList] = useState(null); // which card is open for list view

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const [deptRes, desgRes, countryRes, stateRes, districtRes, tehsilRes] = await Promise.all([
        departmentService.getAllDepartments(),
        designationService.getAllDesignations(),
        countryService.getAllCountries(),
        stateService.getAllStates(),
        districtService.getAllDistricts(),
        tehsilService.getAllTehsils(),
      ]);
      setData({
        departments: deptRes.data,
        designations: desgRes.data,
        countries: countryRes.data,
        states: stateRes.data,
        districts: districtRes.data,
        tehsils: tehsilRes.data,
      });
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  // For bar chart: count active/inactive for each entity if possible
  const getActiveCount = (arr) => arr.filter((x) => x.status).length;

  // For list view: get columns for each entity
  const getColumns = (key) => {
    switch (key) {
      case 'departments':
        return ['id', 'DeptName', 'shortname', 'status'];
      case 'designations':
        return ['id', 'Desgname', 'shortname', 'status'];
      case 'countries':
        return ['conid', 'country', 'status'];
      case 'states':
        return ['stateid', 'state', 'status'];
      case 'districts':
        return ['district_id', 'district_name', 'status'];
      case 'tehsils':
        return ['tehsil_id', 'tehsil_name', 'status'];
      default:
        return [];
    }
  };

  // For list view: get pretty column names
  const getColLabel = (col) => {
    switch (col) {
      case 'id': return 'ID';
      case 'DeptName': return 'Name';
      case 'Desgname': return 'Name';
      case 'shortname': return 'Short Name';
      case 'status': return 'Status';
      case 'conid': return 'ID';
      case 'country': return 'Country';
      case 'stateid': return 'ID';
      case 'state': return 'State';
      case 'district_id': return 'ID';
      case 'district_name': return 'District';
      case 'tehsil_id': return 'ID';
      case 'tehsil_name': return 'Tehsil';
      default: return col;
    }
  };

  // For bar chart: SVG
  const renderBarChart = (total, active, color) => {
    const inactive = total - active;
    const max = Math.max(active, inactive, 1);
    const barW = 32, gap = 8, height = 48;
    const activeH = (active / max) * height;
    const inactiveH = (inactive / max) * height;
    return (
      <svg width={barW * 2 + gap} height={height + 8} style={{ marginTop: 8 }}>
        <rect x={0} y={height - activeH} width={barW} height={activeH} fill={color} rx={6} />
        <rect x={barW + gap} y={height - inactiveH} width={barW} height={inactiveH} fill="#e3e9f7" rx={6} />
        <text x={barW / 2} y={height + 6} textAnchor="middle" fontSize="10" fill="#1976d2">A</text>
        <text x={barW + gap + barW / 2} y={height + 6} textAnchor="middle" fontSize="10" fill="#aaa">I</text>
      </svg>
    );
  };

  return (
    <div className="page-card home-summary-card">
      <h2 className="home-title">Welcome to the Master Management System</h2>
      <p className="home-desc">Manage all your master data in one place. Use the sidebar to navigate between different master tables. Click a card to see a list and chart.</p>
      {loading ? (
        <div className="loader">Loading summary...</div>
      ) : (
        <>
          <div className="summary-grid">
            {entityMeta.map((meta) => {
              const arr = data[meta.key] || [];
              const total = arr.length;
              const active = getActiveCount(arr);
              return (
                <div
                  className="summary-card clickable"
                  key={meta.key}
                  style={{ borderTop: `4px solid ${meta.color}` }}
                  onClick={() => setOpenList(openList === meta.key ? null : meta.key)}
                >
                  <div className="summary-icon" style={{ background: '#fff', color: meta.color }}>{meta.icon}</div>
                  <div className="summary-label">Total {meta.label}</div>
                  <div className="summary-value">{total}</div>
                  {typeof active === 'number' && total > 0 && renderBarChart(total, active, meta.color)}
                </div>
              );
            })}
          </div>
          {openList && (
            <div className="entity-list-view">
              <h3 style={{ textAlign: 'center', color: '#1976d2', margin: '32px 0 16px 0' }}>
                {entityMeta.find((m) => m.key === openList)?.label} List
              </h3>
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      {getColumns(openList).map((col) => (
                        <th key={col}>{getColLabel(col)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data[openList].length === 0 ? (
                      <tr><td colSpan={getColumns(openList).length} style={{ textAlign: 'center' }}>No data found.</td></tr>
                    ) : (
                      data[openList].slice(0, 20).map((row, idx) => (
                        <tr key={row.id || row.conid || row.stateid || row.district_id || row.tehsil_id || idx}>
                          {getColumns(openList).map((col) => (
                            <td key={col}>{col === 'status' ? (row[col] ? 'Active' : 'Inactive') : row[col]}</td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {data[openList].length > 20 && (
                  <div style={{ textAlign: 'center', color: '#888', marginTop: 8 }}>
                    Showing first 20 of {data[openList].length} records
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage; 