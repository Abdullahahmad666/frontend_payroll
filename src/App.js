/**
 * App.js (React + Bootstrap + React Router)
 *
 * Place in src/ of a create-react-app project.
 * Run:
 *   npm install react-router-dom axios bootstrap
 * Then:
 *   npm start
 */
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

/* 
  Array of month options for monthly reports 
*/
const MONTH_NAMES = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

/* ----------------------------------------------------------------
 * NAVBAR - Fixed Logo (no upload)
 * ----------------------------------------------------------------
 */
function NavBar() {
  return (
    <nav className="navbar navbar-dark bg-dark">
        <div className="container d-flex justify-content-center align-items-center">
            <img
            src="https://public.touch2success.com/static/324b0b6d907070b81d45bbb4afc4cef8/img/1734032620phpSy76lF.jpg"
            alt="Philly's Logo"
            style={{ width: 300, height: 60, objectFit: "cover" }}
            className="rounded-0"
            />
        </div>
    </nav>
  );
}

/* ----------------------------------------------------------------
 * HOME MENU
 * ----------------------------------------------------------------
 */
function HomeMenu() {
  return (
    <div className="container mt-4 text-center">
      <h2>Home Menu</h2>
      <p>Please choose an option:</p>
      <div className="row g-3 justify-content-center">
        <div className="col-12 col-sm-4">
          <Link to="/manage" className="btn btn-primary w-100">
            Manage Employees
          </Link>
        </div>
        <div className="col-12 col-sm-4">
          <Link to="/allemployees" className="btn btn-info w-100">
            View All Employees
          </Link>
        </div>
        <div className="col-12 col-sm-4">
          <Link to="/reports" className="btn btn-warning w-100">
            Monthly Reports
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
 * MANAGE EMPLOYEES PAGE
 *  - No negative pay rates
 * ----------------------------------------------------------------
 */
function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [payRate1, setPayRate1] = useState("");
  const [payRate2, setPayRate2] = useState("");
  const [editId, setEditId] = useState(null); // if editing

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/employees");
    setEmployees(res.data);
  };

  const clearForm = () => {
    setName("");
    setRole("");
    setPayRate1("");
    setPayRate2("");
    setEditId(null);
  };

  const saveEmployee = async () => {
    if (!name || !role) {
      alert("Please fill name & role");
      return;
    }

    const rate1 = parseFloat(payRate1) || 0;
    const rate2 = parseFloat(payRate2) || 0;

    // Disallow negative
    if (rate1 < 0 || rate2 < 0) {
      alert("Pay rate cannot be negative.");
      return;
    }

    const payload = {
      name,
      role,
      pay_rate1: rate1,
      pay_rate2: rate2,
    };

    if (editId) {
      await axios.put(`http://localhost:5000/employees/${editId}`, payload);
    } else {
      await axios.post("http://localhost:5000/employees", payload);
    }
    clearForm();
    fetchEmployees();
  };

  const handleEdit = (emp) => {
    setName(emp.name);
    setRole(emp.role);
    setPayRate1(emp.pay_rate1 || "");
    setPayRate2(emp.pay_rate2 || "");
    setEditId(emp._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    await axios.delete(`http://localhost:5000/employees/${id}`);
    fetchEmployees();
  };

  return (
    <div className="container mt-4">
      <h2>Manage Employees</h2>
      <Link to="/" className="btn btn-secondary mb-3">
        Back
      </Link>

      {/* Form */}
      <div className="p-3 mb-3 border rounded">
        <h5>{editId ? "Edit Employee" : "Add Employee"}</h5>
        <div className="row g-2">
          <div className="col">
            <input
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              className="form-control"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
        </div>
        <div className="row g-2 mt-2">
          <div className="col">
            <input
              className="form-control"
              type="number"
              placeholder="Pay Rate 1"
              value={payRate1}
              onChange={(e) => setPayRate1(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              className="form-control"
              type="number"
              placeholder="Pay Rate 2"
              value={payRate2}
              onChange={(e) => setPayRate2(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary mt-2" onClick={saveEmployee}>
          {editId ? "Update Employee" : "Add Employee"}
        </button>
        {editId && (
          <button className="btn btn-secondary ms-2 mt-2" onClick={clearForm}>
            Cancel
          </button>
        )}
      </div>

      {/* Table */}
      <table className="table border border-3 border-primary table-hover table-responsive">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Rate 1 (£)</th>
            <th>Rate 2 (£)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.role}</td>
              <td>{emp.pay_rate1}</td>
              <td>{emp.pay_rate2}</td>
              <td>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleEdit(emp)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(emp._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

/* ----------------------------------------------------------------
 * ALL EMPLOYEES PAGE
 * ----------------------------------------------------------------
 */
function AllEmployees() {
  const [employees, setEmployees] = useState([]);
  const [deleteEmp, setDeleteEmp] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/employees");
    setEmployees(res.data);
  };

  const confirmDelete = async () => {
    if (!deleteEmp) return;
    await axios.delete(`http://localhost:5000/employees/${deleteEmp._id}`);
    setDeleteEmp(null);
    fetchEmployees();
  };

  return (
    <div className="container mt-4">
      <h2>All Employees</h2>
      <Link to="/" className="btn btn-secondary mb-3">
        Back
      </Link>

      <div className="table-responsive">
  <table className="table border border-3 border-success table-striped table-hover">
    <thead className="table-dark">
      <tr>
        <th>Name</th>
        <th>Role</th>
        <th>Rate 1 (£)</th>
        <th>Rate 2 (£)</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {employees.map((emp) => (
        <tr key={emp._id}>
          <td>{emp.name}</td>
          <td>{emp.role}</td>
          <td>{emp.pay_rate1}</td>
          <td>{emp.pay_rate2}</td>
          <td>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              <Link to={`/details/${emp._id}`}>
                <button className="btn btn-info btn-sm">View</button>
              </Link>
              <Link to={`/worklog/${emp._id}`}>
                <button className="btn btn-secondary btn-sm">Log Hours</button>
              </Link>
              <Link to={`/calculate/${emp._id}`}>
                <button className="btn btn-warning btn-sm">Calculate Pay</button>
              </Link>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => setDeleteEmp(emp)}
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* Delete Confirmation Modal */}
      {deleteEmp && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Employee</h5>
                <button
                  className="btn-close"
                  onClick={() => setDeleteEmp(null)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete {deleteEmp.name}?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteEmp(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
 * EMPLOYEE DETAILS
 * ----------------------------------------------------------------
 */
function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState({});
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchEmployee();
    fetchLogs();
    // eslint-disable-next-line
  }, []);

  const fetchEmployee = async () => {
    const res = await axios.get("http://localhost:5000/employees");
    const found = res.data.find((e) => e._id === id);
    if (found) setEmployee(found);
  };

  const fetchLogs = async () => {
    const res = await axios.get(`http://localhost:5000/worklogs/${id}`);
    setLogs(res.data);
  };

  const calculateDailyPay = (log) => {
    const r1 = employee.pay_rate1 || 0;
    const r2 = employee.pay_rate2 || 0;
    const h1 = log.hours_payrate1 || 0;
    const h2 = log.hours_payrate2 || 0;
    const ded = log.deduction || 0;
    return (h1 * r1 + h2 * r2 - ded).toFixed(2);
  };

  return (
    <div className="container mt-4">
      <h2>
        Employee Details - <em>{employee.name}</em>
      </h2>
      <Link to="/allemployees" className="btn btn-secondary mb-3">
        Back
      </Link>

      <div className="table-responsive">
        <table className="table border border-3 border-danger table-hover">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Hours @ Rate1</th>
              <th>Hours @ Rate2</th>
              <th>Deduction (£)</th>
              <th>Daily Pay (£)</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const dayPay = calculateDailyPay(log);
              return (
                <tr key={log._id}>
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                  <td>{log.hours_payrate1}</td>
                  <td>{log.hours_payrate2}</td>
                  <td>{log.deduction}</td>
                  <td>{dayPay}</td>
                </tr>
              );
            })}
            {logs.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No work logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
 * LOG WORK HOURS PAGE
 * ----------------------------------------------------------------
 */
function WorkLogPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState({});
  const [date, setDate] = useState("");
  const [hours1, setHours1] = useState("");
  const [hours2, setHours2] = useState("");
  const [deduction, setDeduction] = useState("0");

  const [showConfirm, setShowConfirm] = useState(false); // for modal

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployee();
    // eslint-disable-next-line
  }, []);

  const fetchEmployee = async () => {
    const res = await axios.get("http://localhost:5000/employees");
    const found = res.data.find((e) => e._id === id);
    if (found) setEmployee(found);
  };

  // Calculate daily pay on the fly
  const dailyPay = () => {
    const r1 = employee.pay_rate1 || 0;
    const r2 = employee.pay_rate2 || 0;
    const h1 = parseFloat(hours1) || 0;
    const h2 = parseFloat(hours2) || 0;
    const ded = parseFloat(deduction) || 0;
    return (h1 * r1 + h2 * r2 - ded).toFixed(2);
  };

  const handleSave = () => {
    setShowConfirm(true);
  };

  const confirmSave = async () => {
    await axios.post("http://localhost:5000/worklogs", {
      employeeId: id,
      date: date ? new Date(date) : new Date(),
      hours_payrate1: parseFloat(hours1) || 0,
      hours_payrate2: parseFloat(hours2) || 0,
      deduction: parseFloat(deduction) || 0,
    });
    setShowConfirm(false);
    alert("Work log added successfully!");
    navigate(`/details/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2>Log Work Hours - {employee.name}</h2>
      <Link to="/allemployees" className="btn btn-secondary mb-3">
        Back
      </Link>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">
            Hours @ Rate1 ( £{employee.pay_rate1 || 0} )
          </label>
          <input
            type="number"
            className="form-control"
            value={hours1}
            onChange={(e) => setHours1(e.target.value)}
          />
        </div>

        {employee.pay_rate2 > 0 && (
          <div className="col-12 col-md-6">
            <label className="form-label">
              Hours @ Rate2 ( £{employee.pay_rate2 || 0} )
            </label>
            <input
              type="number"
              className="form-control"
              value={hours2}
              onChange={(e) => setHours2(e.target.value)}
            />
          </div>
        )}

        <div className="col-12 col-md-6">
          <label className="form-label">Deduction (in £, can be negative)</label>
          <input
            type="number"
            className="form-control"
            value={deduction}
            onChange={(e) => setDeduction(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3 p-2 border rounded bg-light">
        <strong>Daily Pay Preview:</strong> £{dailyPay()}
      </div>

      <button className="btn btn-primary mt-3" onClick={handleSave}>
        Save Work Log
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Work Log</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  You are about to log <strong>{hours1}</strong> hours @ rate1
                  and <strong>{hours2}</strong> hours @ rate2 with a deduction of{" "}
                  <strong>£{deduction}</strong>. <br />
                  The daily pay preview is <strong>£{dailyPay()}</strong>.
                </p>
                <p>Confirm to save?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={confirmSave}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
 * CALCULATE PAY
 * ----------------------------------------------------------------
 */
function CalculatePayPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState({});
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployee();
    // eslint-disable-next-line
  }, []);

  const fetchEmployee = async () => {
    const res = await axios.get("http://localhost:5000/employees");
    const foundEmp = res.data.find((emp) => emp._id === id);
    if (foundEmp) setEmployee(foundEmp);
  };

  const previewPay = async () => {
    const res = await axios.get(`http://localhost:5000/preview-pay/${id}`);
    setPreview(res.data);
  };

  const embusePay = async () => {
    const res = await axios.post(`http://localhost:5000/disburse-pay/${id}`);
    alert(`Pay of £${res.data.netPay} disbursed!`);
    navigate(`/details/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2>Calculate Pay - {employee.name}</h2>
      <Link to="/allemployees" className="btn btn-secondary mb-3">
        Back
      </Link>

      <div className="d-flex gap-2">
        <button className="btn btn-info" onClick={previewPay}>
          Preview Pay
        </button>
        <button className="btn btn-success" onClick={embusePay}>
          Embuse Pay
        </button>
      </div>

      {preview && (
        <div className="alert alert-warning mt-3">
          <h5>Pay Preview</h5>
          <p>
            <strong>Total Hours:</strong> {preview.totalHours}
          </p>
          <p>
            <strong>Total Pay:</strong> £{preview.totalPay}
          </p>
          <p>
            <strong>Deductions:</strong> £{preview.deductions}
          </p>
          <p>
            <strong>Net Pay:</strong> £{preview.netPay}
          </p>
          <p>
            <strong>Last Pay Date:</strong>{" "}
            {new Date(preview.lastPayDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Preview Date:</strong>{" "}
            {new Date(preview.previewDate).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
 * MONTHLY REPORTS
 * ----------------------------------------------------------------
 */
function MonthlyReportPage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("2025");
  const [report, setReport] = useState({ results: [], totalExpense: 0 });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/employees");
    setEmployees(res.data);
  };

  const generateReport = async () => {
    try {
      const params = {};
      if (month) params.month = month; // if blank, backend uses current
      if (year) params.year = year;   // if blank, backend uses current
      if (selectedEmployee) params.employeeId = selectedEmployee;

      const res = await axios.get("http://localhost:5000/reports/monthly", {
        params,
      });
      console.log("Report data:", res.data); // debug
      setReport(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Monthly Reports</h2>
      <Link to="/" className="btn btn-secondary mb-3">
        Back
      </Link>

      <div className="row g-2 align-items-end mb-3">
        {/* Employee dropdown */}
        <div className="col-12 col-sm-4">
          <label>Employee</label>
          <select
            className="form-select"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="all">All Employees</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Month dropdown */}
        <div className="col-12 col-sm-4 col-md-3">
          <label>Month</label>
          <select
            className="form-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">(current)</option>
            {MONTH_NAMES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year input */}
        <div className="col-12 col-sm-4 col-md-3">
          <label>Year</label>
          <input
            type="number"
            className="form-control"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        {/* Generate button */}
        <div className="col-12 col-md-2">
          <button className="btn btn-primary w-100" onClick={generateReport}>
            Generate
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table border border-3 border-dark table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Hours</th>
              <th>Total Pay (£)</th>
              <th>Deductions (£)</th>
              <th>Net Pay (£)</th>
            </tr>
          </thead>
          <tbody>
            {report.results && report.results.length > 0 ? (
              report.results.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.name}</td>
                  <td>{r.role}</td>
                  <td>{r.totalHours}</td>
                  <td>{r.totalPay}</td>
                  <td>{r.totalDeductions}</td>
                  <td>{r.netPay}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 p-2 border border-2 rounded bg-light">
        <strong>
          Total Expense: £
          {report.totalExpense?.toFixed?.(2) ?? report.totalExpense}
        </strong>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
 * MAIN APP
 * ----------------------------------------------------------------
 */
function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomeMenu />} />
        <Route path="/manage" element={<ManageEmployees />} />
        <Route path="/allemployees" element={<AllEmployees />} />
        <Route path="/details/:id" element={<EmployeeDetails />} />
        <Route path="/worklog/:id" element={<WorkLogPage />} />
        <Route path="/calculate/:id" element={<CalculatePayPage />} />
        <Route path="/reports" element={<MonthlyReportPage />} />
      </Routes>
    </>
  );
}

export default App;
