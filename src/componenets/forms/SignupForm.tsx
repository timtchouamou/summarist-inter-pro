'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '../../lib/supabaseAuth'
import { validateSignupForm } from '@/utils/validators'
import { useAuthModal } from '../../store/useAuthModal'

export default function SignupForm() {
  const router = useRouter()
  const { closeModal, openModal } = useAuthModal()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate form
    const validation = validateSignupForm(formData.email, formData.password)
    if (!validation.isValid) {
      return setError(validation.error!)
    }

    setLoading(true)
    const { error } = await signUp(formData.email, formData.password)
    setLoading(false)

    if (error) {
      if (error.message.includes('User already registered')) {
        return setError('Account already exists with this email')
      }
      return setError('Signup failed. Please try again.')
    }

    closeModal()
    router.push('/for-you')
  }

  return (
    <div>
      <h2 className="auth__modal--title">Sign up to Timsand</h2>
      
      {/* Error Message */}
      {error && <div className="auth__error">{error}</div>}

      {/* Signup Form */}
      <form onSubmit={handleSignup}>
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
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      {/* Auth Links */}
      <div className="auth__links">
        <div className="auth__links--separator">
          <button 
            className="auth__link"
            onClick={() => openModal('login')}
          >
            Already have an account?
          </button>
        </div>
      </div>
    </div>
  )
}