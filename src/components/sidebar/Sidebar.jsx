import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockIcon from '@mui/icons-material/Lock';
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">BOREAL SOFT</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>
          <p className="title">LISTAS</p>
          {/* <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </Link> */}
          <Link to="/products" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Productos</span>
            </li>
          </Link>
          <li>
            <CreditCardIcon className="icon" />
            <span>Ordenes</span>
          </li>
          <li>
            <LockIcon className="icon" style={{color:"red"}}/>
            <span>Mensajería</span>
          </li>
          <p className="title">USEFUL</p>
          <li>
            {/* <InsertChartIcon className="icon" /> */}
            <LockIcon className="icon" style={{color:"red"}}/>
            <span>Estadísticas</span>
          </li>
          <li>
            {/* <NotificationsNoneIcon className="icon" /> */}
            <LockIcon className="icon" style={{color:"red"}}/>
            <span>Notificaciones</span>
          </li>
          <p className="title">SERVICE</p>
          <li>
            {/* <SettingsSystemDaydreamOutlinedIcon className="icon" /> */}
            <LockIcon className="icon" style={{color:"red"}}/>
            <span>Sistema</span>
          </li>
          <li>
            {/* <PsychologyOutlinedIcon className="icon" /> */}
            <LockIcon className="icon" style={{color:"red"}}/>
            <span>Logs</span>
          </li>
          <li>
            {/* <SettingsApplicationsIcon className="icon" /> */}
            <LockIcon className="icon" style={{color:"red"}}/>
            <span>Configuración</span>
          </li>
          <p className="title">USER</p>
          <li>
            {/* <AccountCircleOutlinedIcon className="icon" /> */}
            <LockIcon className="icon" style={{color:"red"}}/>
            <span>Profile</span>
          </li>
          <li>
            {/* <ExitToAppIcon className="icon" /> */}
            <LockIcon className="icon" style={{color:"red"}}/>
            <span>Logout</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
