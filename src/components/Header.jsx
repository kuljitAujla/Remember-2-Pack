import logo from "../assets/remember2pack_logo.png"
import { Link, useLocation } from "react-router-dom"

export default function Header() {
  const location = useLocation()
  const isAuthenticatedRoute = location.pathname === '/app' || location.pathname === '/saved'

  return (
    <header>
      <img id="header-logo" src={logo} alt="remember 2 pack Logo"/>
      {isAuthenticatedRoute && (
        <div className="header-actions">
          <Link to="/saved" className="view-saved-btn">
            View Saved
          </Link>
        </div>
      )}
    </header>
  )
}