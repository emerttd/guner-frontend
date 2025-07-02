"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X } from "lucide-react" // İkonları import ediyoruz

const Header = () => {
  const navigate = useNavigate()
  const role = localStorage.getItem("role")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("branchId")
    setIsMenuOpen(false) // Menüyü kapat
    navigate("/login")
  }

  const handleLinkClick = () => {
    setIsMenuOpen(false) // Linke tıklanınca menüyü kapat
  }

  return (
    <header className="app-header">
      <Link to="/orders" className="logo-link" onClick={handleLinkClick}>
        <div className="app-logo">
          <span>Güner</span>
        </div>
      </Link>

      <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <nav className={`main-nav ${isMenuOpen ? "is-open" : ""}`}>
        <Link to="/orders" className="btn btn-secondary" onClick={handleLinkClick}>
          Siparişler
        </Link>
        {/* "Yeni Sipariş" linki kaldırıldı */}
        {role === "super_admin" && (
          <>
            <Link to="/dashboard" className="btn btn-secondary" onClick={handleLinkClick}>
              Dashboard
            </Link>
            <Link to="/branches" className="btn btn-secondary" onClick={handleLinkClick}>
              Şubeler
            </Link>
            <Link to="/users" className="btn btn-secondary" onClick={handleLinkClick}>
              Kullanıcılar
            </Link>
          </>
        )}
        <button onClick={handleLogout} className="btn btn-danger">
          Çıkış Yap
        </button>
      </nav>
    </header>
  )
}

export default Header
