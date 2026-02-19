import { useNavigate } from "react-router-dom";

const MessSecDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="card-grid">
        <div className="card">
          <h3>Total Students</h3>
          <p>120</p>
        </div>

        <div
          className="card clickable"
          onClick={() => navigate("/messsec/mess-cuts")}
        >
          <h3>View Mess Cut Requests</h3>
        </div>
      </div>
    </div>
  );
};

export default MessSecDashboard;
