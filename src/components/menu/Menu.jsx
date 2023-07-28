import React, { useEffect, useState } from "react";
import "./menu.css";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
  BsDoorClosedFill,
} from "react-icons/bs";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import MenuItems from "./MenuItems";
import { useAuth0 } from "@auth0/auth0-react";


export default function Menu(props) {
  const [inactive, setInactive] = useState(false);
  const {
    logout
  } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
        logoutParams: {
          returnTo: window.location.origin,
        }
    });

  let menuItems = [];

  menuItems = [
    {
      name: "Home",
      icon: <FaHome />,
      to: "/",
    },
    {
      name: "Pacientes",
      icon: <FaUserCircle />,
      to: "/pacientes",
    },
    {
      name: "Medicamentos",
      icon: <FiPackage />,
      to: "/pacientes",
    },
  ];

  useEffect(() => {
    props.onCollapse(inactive);
  }, [inactive]);

  return (
    <div className={`side-menu ${inactive ? "inactive" : ""}`}>
      <div className="top-section">
        <div className="logo">
    
        </div>
        <div className="toggle-menu-btn" onClick={() => setInactive(!inactive)}>
          {inactive ? (
            <BsFillArrowRightSquareFill />
          ) : (
            <BsFillArrowLeftSquareFill />
          )}
        </div>
      </div>
      <div className="divider"></div>

      <div className="main-menu">
        <ul>
          {menuItems.map((menuItems, index) => (
            <MenuItems
              key={index}
              name={menuItems.name}
              icon={menuItems.icon}
              to={menuItems.to}
            />
          ))}
        </ul>
      </div>

      <div className="side-menu-footer">
        <ul>
          <li>
            <button onClick={() => logoutWithRedirect()} className="menu-item">
              <div className="menu-icon">
                <BsDoorClosedFill />
              </div>
              <span>Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
