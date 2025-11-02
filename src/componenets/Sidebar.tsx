'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../lib/AuthProvider'
import { useAuthModal } from '../store/useAuthModal'
import { supabase } from '../lib/supabaseClient'
import { 
  AiOutlineHome, 
  AiOutlineUser, 
  AiOutlineLogout,
  AiOutlineLogin,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineSearch,
  AiOutlineBook,
  AiOutlineHighlight,
  AiOutlineQuestionCircle,
  AiOutlineSetting
} from 'react-icons/ai'

interface SidebarProps {
  className?: string
}

interface SidebarLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  disabled?: boolean
  onClick?: () => void
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  href, 
  icon, 
  label, 
  disabled = false,
  onClick 
}) => {
  const pathname = usePathname()
  const isActive = pathname === href

  if (disabled) {
    return (
      <div className="sidebar__link sidebar__link--disabled">
        <div className="sidebar__link-icon">{icon}</div>
        <span className="sidebar__link-text">{label}</span>
      </div>
    )
  }

  return (
    <Link 
      href={href} 
      className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
      onClick={onClick}
    >
      <div className="sidebar__link-icon">{icon}</div>
      <span className="sidebar__link-text">{label}</span>
    </Link>
  )
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { user } = useAuth()
  const { openModal } = useAuthModal()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Don't show sidebar on landing page or choose-plan page
  const hiddenPages = ['/', '/choose-plan']
  const shouldHideSidebar = hiddenPages.includes(pathname)

  const handleAuthAction = async () => {
    if (user) {
      await supabase.auth.signOut()
      setIsMobileOpen(false)
      router.push('/')
    } else {
      openModal('login')
      setIsMobileOpen(false)
    }
  }

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const closeMobileSidebar = () => {
    setIsMobileOpen(false)
  }

  if (shouldHideSidebar) {
    return null
  }

  return (
    <>
      {/* Mobile hamburger button */}
      <button 
        className="sidebar__mobile-toggle"
        onClick={handleMobileToggle}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="sidebar__overlay"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobileOpen ? 'sidebar--mobile-open' : ''} ${className}`}>
        <div className="sidebar__content">
          {/* Logo */}
          <div className="sidebar__header">
            <Link href="/for-you" className="sidebar__logo" onClick={closeMobileSidebar}>
              <AiOutlineBook></AiOutlineBook>
              <span className="sidebar__logo-text">Summarist</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="sidebar__nav">
            <SidebarLink
              href="/for-you"
              icon={<AiOutlineHome />}
              label="For You"
              onClick={closeMobileSidebar}
            />
            
            <SidebarLink
              href="/library"
              icon={<AiOutlineBook />}
              label="Library"
              onClick={closeMobileSidebar}
            />
            
            <SidebarLink
              href="#"
              icon={<AiOutlineHighlight />}
              label="Highlights"
              disabled={true}
            />
            
            <SidebarLink
              href="#"
              icon={<AiOutlineSearch />}
              label="Search"
              disabled={true}
            />
            
            <SidebarLink
              href="/settings"
              icon={<AiOutlineSetting />}
              label="Settings"
              onClick={closeMobileSidebar}
            />
            
            <SidebarLink
              href="#"
              icon={<AiOutlineQuestionCircle />}
              label="Help & Support"
              disabled={true}
            />
          </nav>

          {/* User section */}
          <div className="sidebar__user">
            {user && (
              <div className="sidebar__user-info">
                <div className="sidebar__user-avatar">
                  <AiOutlineUser />
                </div>
                <div className="sidebar__user-details">
                  <div className="sidebar__user-email">{user.email}</div>
                  <div className="sidebar__user-plan">Basic Plan</div>
                </div>
              </div>
            )}
            
            <button 
              className="sidebar__auth-btn"
              onClick={handleAuthAction}
            >
              <div className="sidebar__link-icon">
                {user ? <AiOutlineLogout /> : <AiOutlineLogin />}
              </div>
              <span className="sidebar__link-text">
                {user ? 'Logout' : 'Login'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar