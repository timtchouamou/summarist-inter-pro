'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { signInWithPassword, signInAsGuest } from '../../lib/supabaseAuth'
import { validateLoginForm } from '@/utils/validators'
import { useAuthModal } from '../../store/useAuthModal'

export default function LoginForm() {
  const router = useRouter()
  const { closeModal, openModal } = useAuthModal()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [guestLoading, setGuestLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate form
    const validation = validateLoginForm(formData.email, formData.password)
    if (!validation.isValid) {
      return setError(validation.error!)
    }

    setLoading(true)
    const { error } = await signInWithPassword(formData.email, formData.password)
    setLoading(false)

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return setError('Incorrect email or password')
      }
      return setError('Login failed. Please try again.')
    }

    closeModal()
    router.push('/for-you')
  }

  const handleGuestLogin = async () => {
    setError('')
    setGuestLoading(true)
    
    const { error } = await signInAsGuest()
    setGuestLoading(false)
    
    if (error) {
      return setError('Guest login failed. Please try again.')
    }

    closeModal()
    router.push('/for-you')
  }

  const handleGoogleLogin = async () => {
    setError('Google login coming soon!')
  }

  return (
    <div>
      <h2 className="auth__modal--title">Log in to Summarist</h2>
      
      {/* Guest Login Button */}
      <button
        onClick={handleGuestLogin}
        disabled={guestLoading}
        className="auth__guest--btn"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="auth__btn--icon">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        {guestLoading ? 'Signing in...' : 'Login as a Guest'}
      </button>

      <div className="auth__separator">or</div>

      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        className="auth__google--btn"
      >
        <Image 
          src="/assets/google.png" 
          alt="Google" 
          width={20} 
          height={20} 
          className="auth__btn--icon"
        />
        Login with Google
      </button>

      <div className="auth__separator">or</div>

      {/* Error Message */}
      {error && <div className="auth__error">{error}</div>}

      {/* Login Form */}
      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          className="auth__input"
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className="auth__input"
          required
        />
        
        <button
          type="submit"
          disabled={loading}
          className="btn"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      {/* Auth Links */}
      <div className="auth__links">
        <button className="auth__link">Forgot your password?</button>
        <div className="auth__links--separator">
          <button 
            className="auth__link"
            onClick={() => openModal('signup')}
          >
            Don&apos;t have an account?
          </button>
        </div>
      </div>
    </div>
  )
}