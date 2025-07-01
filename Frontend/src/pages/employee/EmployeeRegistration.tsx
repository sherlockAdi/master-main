import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import employeeService from '../../services/employeeService';
import departmentService from '../../services/departmentService';
import designationService from '../../services/designationService';
import countryService from '../../services/countryService';
import stateService from '../../services/stateService';
import cityService from '../../services/cityService';

// Helper: List of all fields from Atm_M_Employee88
const initialForm: Record<string, any> = {
  id: '',
  firstname: '',
  lastname: '',
  department: '',
  designation: '',
  employeecode: '',
  gender: '',
  officelandline: '',
  dateofjoining: '',
  dateofbirth: '',
  mailaddress: '',
  street: '',
  cityname: '',
  statename: '',
  permanentaddress: '',
  pincode: '',
  dateofanniversary: '',
  homephone: '',
  mobileno: '',
  officeemail: '',
  personalemail: '',
  bloodgroup: '',
  status: true,
  archive: false,
  cheque1: '',
  cheque1bankname: '',
  cheque1date: '',
  cheque2: '',
  cheque2bankname: '',
  cheque2date: '',
  countryname: '',
  punchcode: '',
  isactive: true,
  updatedate: '',
  isupdated: false,
  typeofemp: '',
  IsWaiver: false,
  roleid: '',
  prefix: '',
  isfinal: false,
  panno: '',
  isaccept: false,
  isauthorizedsignatory: false,
  isfaculty: false,
  extensionno: '',
  officialno: '',
  AccountNo: '',
  infavouroff: '',
  IFSCCode: '',
  bankname: '',
  bankbranch: '',
  companyname: '',
  branch: '',
  sugession_and_prob: '',
  showinsalary: false,
  ismeterchecker: false,
  iscashpaid: false,
  isbackDate_leaveallowed: false,
  islocked: false,
  dateOfRelieving: '',
  teamleader: '',
  userblockDate: '',
  fathername: '',
  mothername: '',
  ismanualpunchAllowed: false,
  salary: '',
  DocUploaded: false,
  Remindercounter: '',
  logindate: '',
  fine: '',
  Project: '',
  ViewAttendanceTimeFrom: '',
  ViewAttendanceHour: '',
  ViewAttendanceDate: '',
  ESIStatus: false,
  PFStatus: false,
  TDSStatus: false,
  DeviceId: '',
  pwd: '',
  rollid: '',
  leavetypeid: '',
  WFHType: '',
  Joblocation: '',
  jobbranch: '',
  BankID: '',
  AccountId: '',
  AccountStatus: false,
  ESINumber: '',
  PFNumber: '',
  CostCenter: '',
  ModeofPayment: '',
  Pervocrate: '',
  MaxDay: '',
  fineperdate: '',
  Maxfine: '',
};

const booleanFields: string[] = [
  'status', 'archive', 'isactive', 'isupdated', 'IsWaiver', 'isfinal', 'isaccept', 'isauthorizedsignatory', 'isfaculty', 'showinsalary', 'ismeterchecker', 'iscashpaid', 'isbackDate_leaveallowed', 'islocked', 'ismanualpunchAllowed', 'DocUploaded', 'ESIStatus', 'PFStatus', 'TDSStatus', 'AccountStatus'
];
const dateFields: string[] = [
  'dateofjoining', 'dateofbirth', 'dateofanniversary', 'cheque1date', 'cheque2date', 'updatedate', 'dateOfRelieving', 'userblockDate', 'logindate', 'ViewAttendanceDate'
];

const dropdownFields: Record<string, string[]> = {
  gender: ['Male', 'Female', 'Other'],
  typeofemp: ['Permanent', 'Contract', 'Temporary', 'Intern'],
  bloodgroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  ModeofPayment: ['Cash', 'Cheque', 'Bank Transfer', 'NEFT', 'RTGS'],
  WFHType: ['Full Time', 'Part Time', 'Hybrid', 'Not Allowed'],
  prefix: ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'],
};

const sectionFields: Record<string, string[]> = {
  Personal: [
    'prefix', 'firstname', 'lastname', 'gender', 'dateofbirth', 'fathername', 'mothername', 'dateofanniversary', 'bloodgroup', 'panno', 'personalemail', 'mailaddress', 'street', 'permanentaddress', 'pincode', 'cityname', 'statename', 'countryname',
  ],
  Contact: [
    'mobileno', 'homephone', 'officelandline', 'officeemail', 'extensionno', 'officialno',
  ],
  Employment: [
    'employeecode', 'department', 'designation', 'dateofjoining', 'typeofemp', 'roleid', 'branch', 'companyname', 'project', 'teamleader', 'status', 'archive', 'isactive', 'isupdated', 'IsWaiver', 'isfinal', 'isaccept', 'isauthorizedsignatory', 'isfaculty', 'showinsalary', 'ismeterchecker', 'iscashpaid', 'isbackDate_leaveallowed', 'islocked', 'ismanualpunchAllowed', 'DocUploaded', 'Remindercounter', 'logindate', 'salary', 'fine', 'Project', 'ViewAttendanceTimeFrom', 'ViewAttendanceHour', 'ViewAttendanceDate', 'userblockDate', 'dateOfRelieving', 'punchcode', 'updatedate', 'leavetypeid', 'WFHType', 'Joblocation', 'jobbranch', 'DeviceId', 'pwd', 'rollid',
  ],
  Bank: [
    'AccountNo', 'infavouroff', 'IFSCCode', 'bankname', 'bankbranch', 'cheque1', 'cheque1bankname', 'cheque1date', 'cheque2', 'cheque2bankname', 'cheque2date', 'BankID', 'AccountId', 'AccountStatus', 'ESINumber', 'PFNumber', 'CostCenter', 'ModeofPayment', 'Pervocrate', 'MaxDay', 'fineperdate', 'Maxfine',
  ],
  AttendanceSalary: [
    'ESIStatus', 'PFStatus', 'TDSStatus',
  ],
  Other: [
    'sugession_and_prob', 'showinsalary',
  ],
};

// Utility: Format date to YYYY-MM-DD for input[type=date]
function formatDateForInput(dateValue: any) {
  if (!dateValue) return '';
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

// Utility: Normalize all date fields in a form object
function normalizeFormDates(form: Record<string, any>, dateFields: string[]) {
  const normalized = { ...form };
  dateFields.forEach(field => {
    if (normalized[field]) {
      normalized[field] = formatDateForInput(normalized[field]);
    }
  });
  return normalized;
}

const EmployeeRegistration: React.FC = () => {
  const [form, setForm] = useState<Record<string, any>>(initialForm);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [filteredDesignations, setFilteredDesignations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [activeSection, setActiveSection] = useState('Personal');
  const navigate = useNavigate();
  const location = useLocation();
  const editEmployee = location.state?.employee || null;

  useEffect(() => {
    fetchMasters();
  }, []);

  useEffect(() => {
    if (editEmployee) {
      let normalized = normalizeFormDates({ ...initialForm, ...editEmployee }, dateFields);
      setForm(normalized);
    }
  }, [editEmployee]);

  const fetchMasters = async () => {
    const [deptRes, desigRes, countryRes, stateRes, cityRes] = await Promise.all([
      departmentService.getAllDepartments(),
      designationService.getAllDesignations(),
      countryService.getAllCountries(),
      stateService.getAllStates(),
      cityService.getAllCities(),
    ]);
    setDepartments(deptRes.data || []);
    setDesignations(desigRes.data || []);
    setCountries(countryRes.data || []);
    setStates(stateRes.data || []);
    setCities(cityRes.data || []);
    // Debug: log state objects to find the country reference field
    if (stateRes.data && stateRes.data.length > 0) {
      console.log('Sample state object:', stateRes.data[0]);
    }
  };

  // Location dropdown helpers
  const getFilteredStates = () => {
    if (!form.countryname) return [];
    return states.filter((s: any) => String(s.conid) === String(form.countryname));
  };
  const getFilteredCities = () => {
    if (!form.statename) return [];
    return cities.filter((c: any) => String(c.stateid) === String(form.statename));
  };

  const filteredStates = getFilteredStates();
  const filteredCities = getFilteredCities();

  // Handle change for location fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newForm = { ...form };
    if (type === 'checkbox' && 'checked' in e.target) {
      newForm[name] = (e.target as HTMLInputElement).checked;
    } else {
      newForm[name] = value;
    }
    // Reset state/city if parent changes and update filtered lists
    if (name === 'countryname') {
      newForm.statename = '';
      newForm.cityname = '';
      // Filter states for selected country
      const filtered = states.filter((s: any) => String(s.conid) === String(value));
      setFilteredDesignations([]); // Not related, but clear just in case
      setStates(states); // Keep all states in master, filtered in render
      setCities(cities); // Keep all cities in master, filtered in render
    }
    if (name === 'statename') {
      newForm.cityname = '';
      // Filter cities for selected state
      setCities(cities); // Keep all cities in master, filtered in render
    }
    if (name === 'department') {
      // Filter designations for selected department
      const filtered = designations.filter((d: any) => String(d.deptid) === String(value));
      setFilteredDesignations(filtered);
    }
    setForm(newForm);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode) return;
    setLoading(true);
    try {
      const res = await employeeService.getAllEmployees({ employeecode: searchCode });
      if (res.data && res.data.length > 0) {
        let normalized = normalizeFormDates({ ...initialForm, ...res.data[0] }, dateFields);
        // Map country, state, city, department, designation to correct dropdown values
        if (countries.length > 0 && normalized.countryname) {
          const country = countries.find((c: any) => String(c.conid ?? c.id) === String(normalized.countryname) || c.country === normalized.countryname);
          if (country) normalized.countryname = String(country.conid ?? country.id);
        }
        if (states.length > 0 && normalized.statename) {
          const state = states.find((s: any) => String(s.stateid ?? s.id) === String(normalized.statename) || s.state === normalized.statename);
          if (state) normalized.statename = String(state.stateid ?? state.id);
        }
        if (cities.length > 0 && normalized.cityname) {
          const city = cities.find((c: any) => String(c.cityid ?? c.id) === String(normalized.cityname) || c.city === normalized.cityname);
          if (city) normalized.cityname = String(city.cityid ?? city.id);
        }
        if (departments.length > 0 && normalized.department) {
          const dept = departments.find((d: any) => String(d.id) === String(normalized.department) || d.DeptName === normalized.department);
          if (dept) normalized.department = String(dept.id);
        }
        if (designations.length > 0 && normalized.designation) {
          const desg = designations.find((d: any) => String(d.id) === String(normalized.designation) || d.Desgname === normalized.designation);
          if (desg) normalized.designation = String(desg.id);
        }
        setForm(normalized);
      }
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = { ...form };
      if (editEmployee) {
        await employeeService.updateEmployee(editEmployee.id, submitData);
      } else {
        await employeeService.createEmployee(submitData);
      }
      navigate(-1);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  // Section rendering helper
  const renderSection = (section: string) => {
    if (section === 'Employment') {
      // Custom Employment panel
      // 1. Department & Designation
      // 2. Date fields
      // 3. Other fields (not boolean/date/dropdown)
      // 4. All toggles at the end
      const dateFieldsEmp = ['dateofjoining', 'logindate', 'dateOfRelieving'];
      const booleanFieldsEmp = sectionFields['Employment'].filter(f => booleanFields.includes(f));
      const dropdownFieldsEmp = sectionFields['Employment'].filter(f => dropdownFields[f]);
      const otherFieldsEmp = sectionFields['Employment'].filter(f =>
        !['department', 'designation', ...dateFieldsEmp, ...booleanFieldsEmp].includes(f) && !dropdownFields[f]
      );
      return (
        <div className="col-span-full bg-blue-50/60 rounded-xl p-6 mb-6 shadow-inner border border-blue-100">
          <h3 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
            <span className="inline-block w-2 h-6 bg-blue-400 rounded-full mr-2"></span>
            Employment Details
          </h3>
          {/* Department & Designation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Department */}
            <div className="relative">
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="peer px-4 py-3 border border-blue-300 rounded-xl bg-white/80 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 w-full text-base transition-all font-semibold"
                required
              >
                <option value="">Select Department</option>
                {departments.length === 0 && <option disabled>No departments available</option>}
                {departments.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.DeptName}</option>
                ))}
              </select>
              <label className="absolute left-4 top-2 text-blue-700 text-base bg-white/80 px-1 transition-all duration-200 pointer-events-none peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-600 font-bold">
                Department
              </label>
            </div>
            {/* Designation */}
            <div className="relative">
              <select
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="peer px-4 py-3 border border-blue-300 rounded-xl bg-white/80 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 w-full text-base transition-all font-semibold"
                disabled={!form.department}
                required
              >
                <option value="">Select Designation</option>
                {filteredDesignations.length === 0 && form.department && <option disabled>No designations available</option>}
                {filteredDesignations.length > 0
                  ? filteredDesignations.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.Desgname}</option>
                    ))
                  : designations.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.Desgname}</option>
                    ))}
              </select>
              <label className="absolute left-4 top-2 text-blue-700 text-base bg-white/80 px-1 transition-all duration-200 pointer-events-none peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-600 font-bold">
                Designation
              </label>
            </div>
          </div>
          {/* Date fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {dateFieldsEmp.map(field => (
              <div key={field} className="relative">
                <input
                  type="date"
                  name={field}
                  value={form[field] || ''}
                  onChange={handleChange}
                  className="peer px-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 w-full text-base transition-all"
                  placeholder=" "
                />
                <label className="absolute left-4 top-2 text-gray-500 text-base bg-white/80 px-1 transition-all duration-200 pointer-events-none peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-600">
                  {field}
                </label>
              </div>
            ))}
          </div>
          {/* Other fields (not boolean/date/dropdown) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {otherFieldsEmp.map(field => (
              <div key={field} className="relative">
                <input
                  type={typeof form[field] === 'number' ? 'number' : 'text'}
                  name={field}
                  value={form[field] || ''}
                  onChange={handleChange}
                  className="peer px-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 w-full text-base transition-all placeholder-transparent"
                  placeholder={field}
                />
                <label className="absolute left-4 top-2 text-gray-500 text-base bg-white/80 px-1 transition-all duration-200 pointer-events-none peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-600">
                  {field}
                </label>
              </div>
            ))}
            {/* Dropdown fields (not department/designation) */}
            {dropdownFieldsEmp.map(field => (
              <div key={field} className="relative">
                <select
                  name={field}
                  value={form[field] || ''}
                  onChange={handleChange}
                  className="peer px-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 w-full text-base transition-all"
                >
                  <option value="">Select {field}</option>
                  {dropdownFields[field].map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <label className="absolute left-4 top-2 text-gray-500 text-base bg-white/80 px-1 transition-all duration-200 pointer-events-none peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-600">
                  {field}
                </label>
              </div>
            ))}
          </div>
          {/* All toggles at the end */}
          <div className="flex flex-wrap gap-6 mt-6">
            {booleanFieldsEmp.map(field => (
              <div key={field} className="flex flex-col justify-end">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <span className="text-gray-700 font-medium capitalize flex-1">{field}</span>
                  <span className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      name={field}
                      checked={!!form[field]}
                      onChange={handleChange}
                      className="peer opacity-0 w-12 h-6 absolute left-0 top-0 z-10 cursor-pointer"
                    />
                    <span className="block w-12 h-6 bg-gray-300 rounded-full transition peer-checked:bg-blue-500"></span>
                    <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-6"></span>
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    }
    // For all other sections, use a card panel style
    // Group toggles at the end if present
    const booleanFieldsSection = sectionFields[section].filter(f => booleanFields.includes(f));
    const dateFieldsSection = sectionFields[section].filter(f => dateFields.includes(f));
    const dropdownFieldsSection = sectionFields[section].filter(f => dropdownFields[f]);
    const otherFieldsSection = sectionFields[section].filter(f =>
      ![...booleanFieldsSection, ...dateFieldsSection, ...dropdownFieldsSection, 'countryname', 'statename', 'cityname'].includes(f)
    );
    return (
      <div className="col-span-full bg-blue-50/60 rounded-xl p-6 mb-6 shadow-inner border border-blue-100">
        <h3 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
          <span className="inline-block w-2 h-6 bg-blue-400 rounded-full mr-2"></span>
          {section} Details
        </h3>
        {/* Special block for country/state/city in Personal */}
        {section === 'Personal' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Country */}
            <div className="relative">
              <select
                name="countryname"
                value={form.countryname}
                onChange={handleChange}
                className="peer px-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 w-full text-base transition-all"
                required
              >
                <option value="">Select Country</option>
                {countries.length === 0 && <option disabled>No countries available</option>}
                {countries.map((c: any) => (
                  <option key={c.conid ?? c.id} value={c.conid ?? c.id}>{c.country}</option>
                ))}
              </select>
              <label className="absolute left-4 top-2 text-gray-500 text-base bg-white/80 px-1 transition-all duration-200 pointer-events-none peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-600">
                Country
              </label>
            </div>
            {/* State */}
            <div className="relative">
              <select
                name="statename"
                value={form.statename}
                onChange={handleChange}
                className="peer px-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 w-full text-base transition-all"
                disabled={!form.countryname}
                required
              >
                <option value="">{form.countryname ? 'Select State' : 'Select Country First'}</option>
                {filteredStates.length === 0 && form.countryname && <option disabled>No states available</option>}
                {filteredStates.map((s: any) => (
                  <option key={s.stateid ?? s.id} value={s.stateid ?? s.id}>{s.state || s.name}</option>
                ))}
              </select>
              <label className="absolute left-4 top-2 text-gray-500 text-base bg-white/80 px-1 transition-all duration-200 pointer-events-none peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-600">
                State
              </label>
            </div>
            {/* City */}
            <div className="relative">
              <select
                name="cityname"
                value={form.cityname}
                onChange={handleChange}
                className="peer px-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 w-full text-base transition-all"
                disabled={!form.statename}
                required
              >
                <option value="">{form.statename ? 'Select City' : 'Select State First'}</option>
                {filteredCities.length === 0 && form.statename && <option disabled>No cities available</option>}
                {filteredCities.map((c: any) => (
                  <option key={c.cityid ?? c.id} value={c.cityid ?? c.id}>{c.city}</option>
                ))}
              </select>
              <label className="absolute left-4 top-2 text-gray-500 text-base bg-white/80 px-1 transition-all duration-200 pointer-events-none peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-600">
                City
              </label>
            </div>
          </div>
        )}
        {/* Main grid for all other fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherFieldsSection.map(field => (
            <div key={field} className="relative">
              <input
                type={typeof form[field] === 'number' ? 'number' : 'text'}
                name={field}
                value={form[field] || ''}
                onChange={handleChange}
                className="peer px-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 w-full text-base transition-all placeholder-transparent"
                placeholder={field}
              />
              <label className="absolute left-4 top-2 text-gray-500 text-base bg-white/80 px-1 transition-all duration-200 pointer-events-none peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-600">
                {field}
              </label>
            </div>
          ))}
          {/* Dropdown fields */}
          {dropdownFieldsSection.map(field => (
            <div key={field} className="relative">
              <select
                name={field}
                value={form[field] || ''}
                onChange={handleChange}
                className="peer px-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 w-full text-base transition-all"
              >
                <option value="">Select {field}</option>
                {dropdownFields[field].map((opt: string) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <label className="absolute left-4 top-2 text-gray-500 text-base bg-white/80 px-1 transition-all duration-200 pointer-events-none peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-600">
                {field}
              </label>
            </div>
          ))}
          {/* Date fields */}
          {dateFieldsSection.map(field => (
            <div key={field} className="relative">
              <input
                type="date"
                name={field}
                value={form[field] || ''}
                onChange={handleChange}
                className="peer px-4 py-3 border border-gray-300 rounded-xl bg-white/60 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 w-full text-base transition-all"
                placeholder=" "
              />
              <label className="absolute left-4 top-2 text-gray-500 text-base bg-white/80 px-1 transition-all duration-200 pointer-events-none peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-600">
                {field}
              </label>
            </div>
          ))}
        </div>
        {/* All toggles at the end */}
        {booleanFieldsSection.length > 0 && (
          <div className="flex flex-wrap gap-6 mt-6">
            {booleanFieldsSection.map(field => (
              <div key={field} className="flex flex-col justify-end">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <span className="text-gray-700 font-medium capitalize flex-1">{field}</span>
                  <span className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      name={field}
                      checked={!!form[field]}
                      onChange={handleChange}
                      className="peer opacity-0 w-12 h-6 absolute left-0 top-0 z-10 cursor-pointer"
                    />
                    <span className="block w-12 h-6 bg-gray-300 rounded-full transition peer-checked:bg-blue-500"></span>
                    <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-6"></span>
                  </span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
      {/* Search by Employee Code */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by Employee Code"
          value={searchCode}
          onChange={e => setSearchCode(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {/* Section Tabs */}
      <div className="flex gap-2 mb-6">
        {Object.keys(sectionFields).map(section => (
          <button
            key={section}
            className={`px-4 py-2 rounded-lg font-semibold shadow-sm ${activeSection === section ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveSection(section)}
            type="button"
          >
            {section}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderSection(activeSection)}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-4 py-3 rounded-lg transition-colors text-lg font-semibold shadow"
          disabled={loading}
        >
          {loading ? 'Saving...' : (editEmployee ? 'Update' : 'Register')}
        </button>
      </form>
    </div>
  );
};

export default EmployeeRegistration; 