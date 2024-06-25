import React from 'react'
import {
  IconAlertTriangle,
  IconCpu,
  IconDeviceGamepad,
  IconHome,
  IconSettings
} from '@tabler/icons-react'
import { Link, NavLink } from 'react-router-dom'
import Titlebar from './Titlebar'
function Layout({ children }) {
  return (
    <>
      <Titlebar />
      <div className="sidebar">
        <NavLink to="/">
          <IconHome stroke={2} />
        </NavLink>
        <Link to="#">
          <IconCpu />
        </Link>
        <Link to="#">
          <IconDeviceGamepad stroke={2} />
        </Link>
        <NavLink to="/other">
          <IconAlertTriangle stroke={2} />
        </NavLink>
        <div className="sidebar-bottom">
          <NavLink to="/settings">
            <IconSettings stroke={2} />
            <span className="tooltip">Preferences</span>
          </NavLink>
        </div>
      </div>
      <div className="maincontent">{children}</div>
    </>
  )
}

export default Layout
