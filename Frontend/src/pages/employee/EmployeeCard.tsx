// If you see an error for 'react-icons', run: npm install react-icons
import React, { useState } from 'react';
import employeeService from '../../services/employeeService';
import departmentService from '../../services/departmentService';
import designationService from '../../services/designationService';
import countryService from '../../services/countryService';
import stateService from '../../services/stateService';
import cityService from '../../services/cityService';
import { HiOutlineUserCircle, HiOutlineMail, HiOutlinePhone, HiOutlineOfficeBuilding, HiOutlineBadgeCheck, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineIdentification } from 'react-icons/hi';

const EmployeeCard: React.FC = () => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  React.useEffect(() => {
    departmentService.getAllDepartments().then(res => setDepartments(res.data || []));
    designationService.getAllDesignations().then(res => setDesignations(res.data || []));
    countryService.getAllCountries().then(res => setCountries(res.data || []));
    stateService.getAllStates().then(res => setStates(res.data || []));
    cityService.getAllCities().then(res => setCities(res.data || []));
  }, []);

  // Helper functions
  const getDeptName = (id: number) => {
    const dept = departments.find(d => d.id == id);
    return dept ? dept.DeptName : '';
  };
  const getDesgName = (id: number) => {
    const desig = designations.find(d => d.id == id);
    return desig ? desig.Desgname : '';
  };
  const getCountryName = (id: number) => {
    const c = countries.find(c => c.id == id || c.conid == id);
    return c ? (c.CountryName || c.country || c.name) : '';
  };
  const getStateName = (id: number) => {
    const s = states.find(s => s.id == id || s.stateid == id);
    return s ? (s.StateName || s.state || s.name) : '';
  };
  const getCityName = (id: number) => {
    const c = cities.find(c => c.id == id || c.cityid == id);
    return c ? (c.CityName || c.city || c.name) : '';
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmployee(null);
    try {
      if (!employeeCode) {
        setError('Please enter employee code.');
        setLoading(false);
        return;
      }
      const res = await employeeService.getAllEmployees({ employeecode: employeeCode });
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        setEmployee(res.data[0]);
      } else if (Array.isArray(res) && res.length > 0) {
        setEmployee(res[0]);
      } else {
        setError('No employee found.');
      }
    } catch (err) {
      setError('Error occurred while searching.');
    } finally {
      setLoading(false);
    }
  };

  // Group fields for display
  const getSectionFields = (emp: any) => ({
    Personal: [
      { label: 'First Name', value: emp.firstname },
      { label: 'Last Name', value: emp.lastname },
      { label: 'Gender', value: emp.gender },
      { label: 'Date of Birth', value: emp.dateofbirth?.slice(0, 10) },
      { label: 'Blood Group', value: emp.bloodgroup },
      { label: 'PAN No', value: emp.panno },
      { label: 'Father Name', value: emp.fathername },
      { label: 'Mother Name', value: emp.mothername },
      { label: 'Anniversary', value: emp.dateofanniversary?.slice(0, 10) },
    ],
    Contact: [
      { label: 'Mobile', value: emp.mobileno, icon: <HiOutlinePhone className="inline mr-1" /> },
      { label: 'Office Email', value: emp.officeemail, icon: <HiOutlineMail className="inline mr-1" /> },
      { label: 'Personal Email', value: emp.personalemail },
      { label: 'Home Phone', value: emp.homephone },
      { label: 'Office Landline', value: emp.officelandline },
      { label: 'Extension No', value: emp.extensionno },
      { label: 'Official No', value: emp.officialno },
    ],
    Address: [
      { label: 'Permanent Address', value: emp.permanentaddress },
      { label: 'Mail Address', value: emp.mailaddress },
      { label: 'Street', value: emp.street },
      { label: 'Pincode', value: emp.pincode },
      { label: 'City', value: getCityName(emp.cityname) || emp.cityname },
      { label: 'State', value: getStateName(emp.statename) || emp.statename },
      { label: 'Country', value: getCountryName(emp.countryname) || emp.countryname },
    ],
    Employment: [
      { label: 'Employee Code', value: emp.employeecode, icon: <HiOutlineIdentification className="inline mr-1" /> },
      { label: 'Department', value: getDeptName(emp.department) || emp.departmentname, icon: <HiOutlineOfficeBuilding className="inline mr-1" /> },
      { label: 'Designation', value: getDesgName(emp.designation) || emp.designationname, icon: <HiOutlineBadgeCheck className="inline mr-1" /> },
      { label: 'Date of Joining', value: emp.dateofjoining?.slice(0, 10), icon: <HiOutlineCalendar className="inline mr-1" /> },
      { label: 'Status', value: emp.status ? 'Active' : 'Inactive', badge: emp.status ? 'green' : 'red' },
      { label: 'Type of Employee', value: emp.typeofemp },
      { label: 'Punch Code', value: emp.punchcode },
      { label: 'Team Leader', value: emp.teamleader },
      { label: 'Company Name', value: emp.companyname },
      { label: 'Branch', value: emp.branch },
    ],
    Bank: [
      { label: 'Account No', value: emp.AccountNo },
      { label: 'Bank Name', value: emp.bankname },
      { label: 'Bank Branch', value: emp.bankbranch },
      { label: 'IFSC Code', value: emp.IFSCCode },
      { label: 'Mode of Payment', value: emp.ModeofPayment },
    ],
  });

  const renderSection = (title: string, fields: any[]) => (
    <div className="mb-6">
      <h4 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2">
        <span className="inline-block w-1 h-5 bg-blue-400 rounded-full mr-2"></span>
        {title}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f, idx) =>
          f.value ? (
            <div key={idx} className="flex items-center gap-2">
              {f.icon}
              <span className="font-medium text-gray-700">{f.label}:</span>
              {f.badge ? (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold bg-${f.badge}-100 text-${f.badge}-700`}>{f.value}</span>
              ) : (
                <span className="ml-2 text-gray-900">{f.value}</span>
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-10 p-0 md:p-8 rounded-3xl shadow-2xl bg-white/70 backdrop-blur-lg border border-blue-100">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
        <HiOutlineUserCircle className="text-3xl text-blue-400 mr-2" />
        Employee Details
      </h2>
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter Employee Code"
          value={employeeCode}
          onChange={e => setEmployeeCode(e.target.value)}
          className="flex-1 px-5 py-3 rounded-xl border border-gray-300 bg-white/60 shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all text-lg placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow transition-all text-lg"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {employee && (
        <div className="bg-white/80 rounded-2xl shadow-lg border border-blue-100 p-6 md:p-10 transition-all mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            {employee.image ? (
              <img src={employee.image} alt="Employee" className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-blue-400 text-5xl border-4 border-blue-200 shadow">
                <span>{employee.firstname?.[0] || '?'}</span>
              </div>
            )}
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-900 mb-1">{employee.firstname} {employee.lastname}</div>
              <div className="text-blue-600 font-semibold text-lg mb-1">{getDesgName(employee.designation) || employee.designationname || ''}</div>
              <div className="text-gray-500 mb-1">{getDeptName(employee.department) || employee.departmentname || ''}</div>
              <div className="text-gray-400 text-sm">Employee Code: {employee.employeecode}</div>
              <div className="mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-${employee.status ? 'green' : 'red'}-100 text-${employee.status ? 'green' : 'red'}-700`}>{employee.status ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
          {/* Sections */}
          {Object.entries(getSectionFields(employee)).map(([section, fields]) => renderSection(section, fields))}
        </div>
      )}
    </div>
  );
};

export default EmployeeCard; 