'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

interface LayoutWrapperProps {
  children: React.ReactNode
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname()
  
  // Pages that should NOT have sidebar margin
  const hiddenSidebarPages = ['/', '/choose-plan']
  const shouldHideSidebar = hiddenSidebarPages.includes(pathname)
  
  return (
    <div className={shouldHideSidebar ? 'without-sidebar' : 'with-sidebar'}>
      {children}
    </div>
  )
}

export default LayoutWrapper