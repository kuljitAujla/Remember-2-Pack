import logo from "../assets/remember2pack_logo.png"
import hamburgerIcon from "../assets/hamburger-menu.png"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import "../styles/header.css"

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthenticatedRoute = location.pathname === '/app' || location.pathname === '/saved'
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      
      if (response.ok) {
        navigate('/')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header>
      <div className="header-left">
        <img id="header-logo" src={logo} alt="remember 2 pack Logo"/>
      </div>
      <div className="header-center">
        {/* Empty div for balance on desktop */}
      </div>
      <div className="header-right">
        {isAuthenticatedRoute && (
          <div className="menu-container">
            <button className="hamburger-menu" onClick={toggleMenu}>
              <img src={hamburgerIcon} alt="Menu" className="hamburger-icon" />
            </button>
            
            {isMenuOpen && (
              <div className="dropdown-menu">
                <Link to="/saved" className="menu-item" onClick={() => setIsMenuOpen(false)}>
                  View Saved
                </Link>
                <button className="menu-item logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}