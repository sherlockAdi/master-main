import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import employeeService from '../../services/employeeService';
import departmentService from '../../services/departmentService';
import designationService from '../../services/designationService';
import countryService from '../../services/countryService';
import stateService from '../../services/stateService';
import cityService from '../../services/cityService';

const initialForm = {
  firstname: '',
  lastname: '',
  department: '',
  designation: '',
  employeecode: '',
  mobileno: '',
  officeemail: '',
  status: true,
  country: '',
  state: '',
  city: '',
  dateofjoining: '',
  dateofbirth: '',
  gender: '',
  permanentaddress: '',
  image: '', // will store base64 or url
};

const EmployeeRegistration: React.FC = () => {
  const [form, setForm] = useState(initialForm);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const editEmployee = location.state?.employee || null;
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchMasters();
    if (editEmployee) {
        console.log(editEmployee)
      setForm({
        ...editEmployee,
        department: editEmployee.department?.toString() || '',
        designation: editEmployee.designation?.toString() || '',
        country: editEmployee.countryname?.toString() || '',
        state: editEmployee.statename?.toString() || '',
        city: editEmployee.cityname?.toString() || '',
      });
      
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
  };

  // Handlers for dependent dropdowns
  useEffect(() => {
    if (form.country) {
      stateService.getAllStates().then(res => {
        setStates((res.data || []).filter((s: any) => s.countryid == form.country));
      });
    }
  }, [form.country]);

  useEffect(() => {
    if (form.state) {
      cityService.getAllCities().then(res => {
        setCities((res.data || []).filter((c: any) => c.stateid == form.state));
      });
    }
  }, [form.state]);

  useEffect(() => {
    if (form.department) {
      designationService.getAllDesignations(form.department).then(res => {
        setDesignations(res.data || []);
      });
    } else {
      designationService.getAllDesignations().then(res => setDesignations(res.data || []));
    }
  }, [form.department]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox') newValue = (e.target as HTMLInputElement).checked;
    setForm(prev => ({ ...prev, [name]: newValue }));
    // Reset dependent fields
    if (name === 'country') setForm(prev => ({ ...prev, state: '', city: '' }));
    if (name === 'state') setForm(prev => ({ ...prev, city: '' }));
    if (name === 'department') setForm(prev => ({ ...prev, designation: '' }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result as string }));
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        ...form,
        department: parseInt(form.department),
        designation: parseInt(form.designation),
        country: parseInt(form.country),
        state: parseInt(form.state),
        city: parseInt(form.city),
      };
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

  // Helper functions for names
  const getDeptName = (id: string | number) => {
    const dept = departments.find((d: any) => d.id == Number(id));
    return dept ? dept.DeptName : '';
  };
  const getDesgName = (id: string | number) => {
    const desig = designations.find((d: any) => d.id == Number(id));
    return desig ? desig.Desgname : '';
  };
  const getCountryName = (id: string | number) => {
    console.log(id , countries)
    const c = countries.find((c: any) => c.conid == Number(id));
    // console.log(c.country)
    return c ? (c.country) : '';
  };
  const getStateName = (id: string | number) => {
    const s = states.find((s: any) => s.id == Number(id));
    return s ? (s.state) : '';
  };
  const getCityName = (id: string | number) => {
    const c = cities.find((c: any) => c.id == Number(id));
    return c ? (c.city) : '';
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">{editEmployee ? 'Edit Employee' : 'Employee Registration'}</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            placeholder="First Name"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
            required
          />
          <input
            type="text"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            placeholder="Last Name"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
            required
          >
            <option value="">Select Department</option>
            {departments.map((d: any) => (
              <option key={d.id} value={d.id}>{d.DeptName}</option>
            ))}
          </select>
          <select
            name="designation"
            value={form.designation}
            onChange={handleChange}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
            required
          >
            <option value="">Select Designation</option>
            {designations.map((d: any) => (
              <option key={d.id} value={d.id}>{d.Desgname}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
            required
          >
            <option value="">Select Country</option>
            {countries.map((c: any) => (
              <option key={c.id} value={c.id}>{c.country}</option>
            ))}
          </select>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
            required
            disabled={!form.country}
          >
            <option value="">Select State</option>
            {states.map((s: any) => (
              <option key={s.id} value={s.id}>{s.state || s.name}</option>
            ))}
          </select>
          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
            required
            disabled={!form.state}
          >
            <option value="">Select City</option>
            {cities.map((c: any) => (
              <option key={c.id} value={c.id}>{c.city || c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            name="employeecode"
            value={form.employeecode}
            onChange={handleChange}
            placeholder="Employee Code"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
            required
          />
          <input
            type="text"
            name="mobileno"
            value={form.mobileno}
            onChange={handleChange}
            placeholder="Mobile No"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="email"
            name="officeemail"
            value={form.officeemail}
            onChange={handleChange}
            placeholder="Office Email"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
            required
          />
          <input
            type="date"
            name="dateofjoining"
            value={form.dateofjoining}
            onChange={handleChange}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
            required
            title="Date of Joining"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="date"
            name="dateofbirth"
            value={form.dateofbirth}
            onChange={handleChange}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
            required
            title="Date of Birth"
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <textarea
          name="permanentaddress"
          value={form.permanentaddress}
          onChange={handleChange}
          placeholder="Permanent Address"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200"
          rows={2}
          required
        />
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <label className="flex-1 flex flex-col gap-2">
            <span className="font-medium text-gray-700">Profile Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </label>
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-blue-200" />
          )}
        </div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="status"
            checked={form.status}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700 font-medium">Active</span>
        </label>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-4 py-3 rounded-lg transition-colors text-lg font-semibold shadow"
          disabled={loading}
        >
          {loading ? 'Saving...' : (editEmployee ? 'Update' : 'Register')}
        </button>
      </form>
      {/* Summary Section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-blue-700">Summary</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="font-semibold">First Name:</span> {form.firstname}</div>
          <div><span className="font-semibold">Last Name:</span> {form.lastname}</div>
          <div><span className="font-semibold">Department:</span> {getDeptName(form.department)}</div>
          <div><span className="font-semibold">Designation:</span> {getDesgName(form.designation)}</div>
          <div><span className="font-semibold">Country:</span> {getCountryName(form.country)}</div>
          <div><span className="font-semibold">State:</span> {getStateName(form.state)}</div>
          <div><span className="font-semibold">City:</span> {getCityName(form.city)}</div>
          <div><span className="font-semibold">Employee Code:</span> {form.employeecode}</div>
          <div><span className="font-semibold">Mobile:</span> {form.mobileno}</div>
          <div><span className="font-semibold">Office Email:</span> {form.officeemail}</div>
          <div><span className="font-semibold">Date of Joining:</span> {form.dateofjoining}</div>
          <div><span className="font-semibold">Date of Birth:</span> {form.dateofbirth}</div>
          <div><span className="font-semibold">Gender:</span> {form.gender}</div>
          <div><span className="font-semibold">Permanent Address:</span> {form.permanentaddress}</div>
          <div><span className="font-semibold">Status:</span> <span className={form.status ? 'text-green-600' : 'text-red-600'}>{form.status ? 'Active' : 'Inactive'}</span></div>
          <div className="col-span-2 flex items-center gap-2"><span className="font-semibold">Profile Image:</span> {imagePreview && <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-full object-cover border-2 border-blue-200" />}</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegistration; 