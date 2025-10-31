'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthProvider'
import { useAuthModal } from '@/store/useAuthModal'
import { signOut } from '@/lib/supabaseAuth'
import { AiOutlineUser, AiOutlineMail, AiOutlineLogout, AiOutlineSetting } from 'react-icons/ai'
import { BiCrown } from 'react-icons/bi'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const { openModal } = useAuthModal()
  const router = useRouter()
  
  // Mock subscription data - in real app this would come from Supabase
  const [subscriptionTier] = useState<'basic' | 'premium' | 'premium-plus'>('basic')
  const [subscriptionStatus] = useState<'active' | 'cancelled' | 'expired'>('active')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleUpgrade = () => {
    router.push('/choose-plan')
  }

  const getSubscriptionDetails = () => {
    switch (subscriptionTier) {
      case 'premium':
        return {
          name: 'Premium',
          price: '$9.99/month',
          features: ['Access to 1000+ book summaries', 'Unlimited listening', 'Offline reading']
        }
      case 'premium-plus':
        return {
          name: 'Premium Plus',
          price: '$12.99/month',
          features: ['Everything in Premium', 'Access to premium audiobooks', 'Exclusive content', 'Priority support']
        }
      default:
        return {
          name: 'Basic',
          price: 'Free',
          features: ['Limited access to summaries', 'Basic features only']
        }
    }
  }

  if (loading) {
    return (
      <div className="settings__container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="settings__container">
        <div className="settings__login-prompt">
          <AiOutlineUser className="settings__login-icon" />
          <h2>Please log in to access settings</h2>
          <p>You need to be logged in to view and manage your account settings.</p>
          <button onClick={() => openModal('login')} className="btn">
            Login
          </button>
        </div>
      </div>
    )
  }

  const subscription = getSubscriptionDetails()

  return (
    <div className="settings__container">
      <div className="settings__header">
        <div className="settings__header-content">
          <AiOutlineSetting className="settings__header-icon" />
          <h1>Settings</h1>
        </div>
      </div>

      <div className="settings__content">
        {/* Account Information */}
        <div className="settings__section">
          <h2 className="settings__section-title">Account Information</h2>
          <div className="settings__card">
            <div className="settings__item">
              <div className="settings__item-icon">
                <AiOutlineMail />
              </div>
              <div className="settings__item-content">
                <div className="settings__item-label">Email Address</div>
                <div className="settings__item-value">{user.email}</div>
              </div>
            </div>
            
            <div className="settings__item">
              <div className="settings__item-icon">
                <AiOutlineUser />
              </div>
              <div className="settings__item-content">
                <div className="settings__item-label">Account Type</div>
                <div className="settings__item-value">Personal Account</div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="settings__section">
          <h2 className="settings__section-title">Subscription</h2>
          <div className="settings__card">
            <div className="settings__subscription-header">
              <div className="settings__subscription-info">
                <div className="settings__subscription-tier">
                  <BiCrown className="settings__crown-icon" />
                  <span className="settings__tier-name">{subscription.name}</span>
                </div>
                <div className="settings__subscription-price">{subscription.price}</div>
              </div>
              {subscriptionTier === 'basic' && (
                <button onClick={handleUpgrade} className="btn settings__upgrade-btn">
                  Upgrade Plan
                </button>
              )}
            </div>
            
            <div className="settings__subscription-features">
              <h3>Your Plan Includes:</h3>
              <ul className="settings__features-list">
                {subscription.features.map((feature, index) => (
                  <li key={index} className="settings__feature-item">
                    <span className="settings__feature-check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {subscriptionTier !== 'basic' && (
              <div className="settings__subscription-status">
                <div className="settings__status-item">
                  <span className="settings__status-label">Status:</span>
                  <span className={`settings__status-value settings__status-value--${subscriptionStatus}`}>
                    {subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}
                  </span>
                </div>
                <div className="settings__status-item">
                  <span className="settings__status-label">Next Billing:</span>
                  <span className="settings__status-value">January 21, 2025</span>
                </div>
              </div>
            )}

            {subscriptionTier !== 'basic' && subscriptionTier !== 'premium-plus' && (
              <div className="settings__upgrade-section">
                <h3>Want more features?</h3>
                <p>Upgrade to Premium Plus for exclusive content and priority support.</p>
                <button onClick={handleUpgrade} className="btn settings__upgrade-btn">
                  Upgrade to Premium Plus
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className="settings__section">
          <h2 className="settings__section-title">Account Actions</h2>
          <div className="settings__card">
            <button onClick={handleLogout} className="settings__logout-btn">
              <AiOutlineLogout />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* App Information */}
        <div className="settings__section">
          <h2 className="settings__section-title">About</h2>
          <div className="settings__card">
            <div className="settings__app-info">
              <div className="settings__app-item">
                <span className="settings__app-label">Version:</span>
                <span className="settings__app-value">1.0.0</span>
              </div>
              <div className="settings__app-item">
                <span className="settings__app-label">Build:</span>
                <span className="settings__app-value">2025.01.21</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}