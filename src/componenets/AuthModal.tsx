'use client'

import { useAuthModal } from '@/store/useAuthModal'
import { useEffect } from 'react'
import LoginForm from './forms/LoginForm'
import SignupForm from './forms/SignupForm'

export default function AuthModal() {
  const { isOpen, mode, closeModal } = useAuthModal()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [closeModal, isOpen])

  if (!isOpen) return null

  return (
    <div className="auth__modal">
      <div className="auth__modal--content">
        <button
          onClick={closeModal}
          className="auth__modal--close"
        >
          ×
        </button>
        {mode === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  )
}