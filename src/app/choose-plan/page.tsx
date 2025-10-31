'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '../../lib/AuthProvider'
import { useAuthModal } from '../../store/useAuthModal'
import { AiOutlineCheck, AiOutlineStar } from 'react-icons/ai'
import { BiCrown } from 'react-icons/bi'

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  id: string
  name: string
  price: number
  originalPrice?: number
  period: string
  description: string
  features: PlanFeature[]
  popular?: boolean
  trial?: string
}

export default function ChoosePlanPage() {
  const { user } = useAuth()
  const { openModal } = useAuthModal()
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [selectedPlan, setSelectedPlan] = useState<string>('premium-plus')

  const plans: Plan[] = [
    {
      id: 'premium',
      name: 'Premium',
      price: billingCycle === 'yearly' ? 99 : 9.99,
      originalPrice: billingCycle === 'yearly' ? 119.88 : undefined,
      period: billingCycle === 'yearly' ? 'year' : 'month',
      description: 'Perfect for individuals',
      trial: billingCycle === 'yearly' ? '7-day free trial' : undefined,
      features: [
        { text: 'Access to 1000+ book summaries', included: true },
        { text: 'Unlimited listening', included: true },
        { text: 'Offline reading', included: true },
        { text: 'Premium customer support', included: true },
        { text: 'Cancel anytime', included: true }
      ]
    },
    {
      id: 'premium-plus',
      name: 'Premium Plus',
      price: billingCycle === 'yearly' ? 129 : 12.99,
      originalPrice: billingCycle === 'yearly' ? 155.88 : undefined,
      period: billingCycle === 'yearly' ? 'year' : 'month',
      description: 'Most popular choice',
      popular: true,
      trial: billingCycle === 'yearly' ? '7-day free trial' : undefined,
      features: [
        { text: 'Everything in Premium', included: true },
        { text: 'Access to premium audiobooks', included: true },
        { text: 'Exclusive content', included: true },
        { text: 'Priority customer support', included: true },
        { text: 'Early access to new features', included: true }
      ]
    }
  ]

  const handlePlanSelection = async (planId: string) => {
    setSelectedPlan(planId)
    
    if (!user) {
      openModal('login')
      return
    }

    // Here you would integrate with Stripe
    // For now, we'll just show a success message
    alert(`You selected the ${plans.find(p => p.id === planId)?.name} plan! This would normally redirect to Stripe checkout.`)
  }

  const savings = billingCycle === 'yearly' 
    ? Math.round(((119.88 - 99) / 119.88) * 100)
    : 0

  return (
    <div className="choose-plan__container">
      <div className="choose-plan__wrapper">
        {/* Header */}
        <div className="choose-plan__header">
          <button 
            onClick={() => router.back()} 
            className="choose-plan__back-btn"
          >
            ← Back
          </button>
          
          <div className="choose-plan__hero">
            <div className="choose-plan__hero-image">
              <Image 
                src="/assets/pricing-top.png" 
                alt="Upgrade to Premium" 
                width={400}
                height={200}
                quality={85}
                priority={true}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyziw3yOWSvADU7f5P7pwr8+z6aH/Z"
              />
            </div>
            
            <div className="choose-plan__hero-content">
              <h1 className="choose-plan__title">
                Get unlimited access to many amazing books to read
              </h1>
              <p className="choose-plan__subtitle">
                Turn ordinary moments into amazing learning opportunities
              </p>

              {/* Billing Toggle */}
              <div className="choose-plan__billing-toggle">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`choose-plan__billing-btn ${
                    billingCycle === 'monthly' ? 'choose-plan__billing-btn--active' : ''
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`choose-plan__billing-btn ${
                    billingCycle === 'yearly' ? 'choose-plan__billing-btn--active' : ''
                  }`}
                >
                  Yearly
                  {savings > 0 && (
                    <span className="choose-plan__savings">Save {savings}%</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="choose-plan__plans">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`choose-plan__plan ${
                plan.popular ? 'choose-plan__plan--popular' : ''
              } ${
                selectedPlan === plan.id ? 'choose-plan__plan--selected' : ''
              }`}
            >
              {plan.popular && (
                <div className="choose-plan__popular-badge">
                  <AiOutlineStar />
                  Most Popular
                </div>
              )}

              <div className="choose-plan__plan-header">
                <div className="choose-plan__plan-icon">
                  <BiCrown />
                </div>
                <h3 className="choose-plan__plan-name">{plan.name}</h3>
                <p className="choose-plan__plan-description">{plan.description}</p>
              </div>

              <div className="choose-plan__plan-pricing">
                <div className="choose-plan__plan-price">
                  <span className="choose-plan__plan-currency">$</span>
                  <span className="choose-plan__plan-amount">{plan.price}</span>
                  <span className="choose-plan__plan-period">/{plan.period}</span>
                </div>
                
                {plan.originalPrice && (
                  <div className="choose-plan__plan-original-price">
                    <span>${plan.originalPrice}/{plan.period}</span>
                  </div>
                )}
                
                {plan.trial && (
                  <div className="choose-plan__plan-trial">{plan.trial}</div>
                )}
              </div>

              <ul className="choose-plan__plan-features">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className={`choose-plan__plan-feature ${
                      feature.included
                        ? 'choose-plan__plan-feature--included'
                        : 'choose-plan__plan-feature--excluded'
                    }`}
                  >
                    <AiOutlineCheck className="choose-plan__plan-feature-icon" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelection(plan.id)}
                className={`btn choose-plan__plan-btn ${
                  plan.popular ? 'choose-plan__plan-btn--popular' : ''
                }`}
              >
                {selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="choose-plan__footer">
          <p className="choose-plan__footer-text">
            Cancel your trial at any time before it ends, and you won&apos;t be charged.
          </p>
        </div>
      </div>
    </div>
  )
}