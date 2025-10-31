'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Book } from '../types/book'
import { useAuth } from '../lib/AuthProvider'
import { useAuthModal } from '../store/useAuthModal'
import { AiOutlineBook } from 'react-icons/ai'
import { BsPlayFill } from 'react-icons/bs'

interface BookFeatureCardProps {
  book: Book
}

const BookFeatureCard: React.FC<BookFeatureCardProps> = ({ book }) => {
  const { user } = useAuth()
  const { openModal } = useAuthModal()
  const router = useRouter()
  const [imageError, setImageError] = useState(false)

  // For now, we'll assume all users are "basic" plan
  // In a real app, you'd get this from user's subscription data
  const userSubscriptionTier = 'basic' // 'basic' | 'premium' | 'premium-plus'
  const isSubscribed = userSubscriptionTier !== 'basic'

  const handleClick = () => {
    // Not logged in → show auth modal
    if (!user) {
      openModal('login')
      return
    }

    // Check if book requires subscription
    if (book.subscriptionRequired && !isSubscribed) {
      // Logged in but not subscribed → redirect /choose-plan
      router.push('/choose-plan')
      return
    }

    // Subscribed or free content → go to /book/:id
    router.push(`/book/${book.id}`)
  }

  const handleActionClick = (e: React.MouseEvent, action: 'read' | 'listen') => {
    e.stopPropagation()
    
    if (!user) {
      openModal('login')
      return
    }

    if (book.subscriptionRequired && !isSubscribed) {
      router.push('/choose-plan')
      return
    }

    if (action === 'listen' && book.audioLink) {
      router.push(`/player/${book.id}`)
    } else {
      router.push(`/book/${book.id}`)
    }
  }

  return (
    <div className="selected-book" onClick={handleClick}>
      <div className="selected-book__content">
        <div className="selected-book__image-wrapper">
          <Image 
            src={imageError || !book.imageLink ? "/assets/logo.png" : book.imageLink} 
            alt={`${book.title} by ${book.author} - Book cover`}
            className="selected-book__image"
            width={200}
            height={240}
            quality={95}
            priority
            sizes="(max-width: 768px) 200px, 240px"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyziw3yOWSvADU7f5P7pwr8+z6aH/Z"
            onError={() => setImageError(true)}
          />
          {book.subscriptionRequired && (
            <div className="book__premium-pill book__premium-pill--large">Premium</div>
          )}
        </div>
        
        <div className="selected-book__info">
          <div className="selected-book__subtitle">Selected just for you</div>
          <h2 className="selected-book__title">{book.title}</h2>
          <div className="selected-book__author">by {book.author}</div>
          
          {book.subTitle && (
            <div className="selected-book__subtitle-text">{book.subTitle}</div>
          )}
          
          <div className="selected-book__description">
            {book.summary || book.bookDescription || 'Discover the key insights from this amazing book.'}
          </div>
          
          <div className="selected-book__actions">
            <button 
              className="selected-book__action-btn selected-book__action-btn--primary"
              onClick={(e) => handleActionClick(e, 'read')}
            >
              <AiOutlineBook />
              <span>Read</span>
            </button>
            
            {book.audioLink && (
              <button 
                className="selected-book__action-btn selected-book__action-btn--secondary"
                onClick={(e) => handleActionClick(e, 'listen')}
              >
                <BsPlayFill />
                <span>Listen</span>
              </button>
            )}
          </div>
          
          {book.subscriptionRequired && !isSubscribed && (
            <div className="selected-book__premium-notice">
              <span>Premium content - </span>
              <button 
                className="selected-book__upgrade-link"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push('/choose-plan')
                }}
              >
                Upgrade to access
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookFeatureCard