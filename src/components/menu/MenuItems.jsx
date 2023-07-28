import React from "react";
import { NavLink } from "react-router-dom";

export default function MenuItems(props) {
  const { name, icon, to } = props;

  return (
    <li>
      <NavLink to={to} className="menu-item" >
        <div className="menu-icon">
            {icon}
        </div>
        <span> {name} </span>
      </NavLink>
    </li>
  );
}
