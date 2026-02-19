import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Menu</h2>

      <NavLink to="/messsec/dashboard">Dashboard</NavLink>
      <NavLink to="/messsec/mess-cuts">Mess Cuts</NavLink>
    </div>
  );
};

export default Sidebar;
