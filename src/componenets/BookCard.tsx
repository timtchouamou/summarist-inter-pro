'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Book } from '../types/book'
import { getAudioDuration, formatDuration } from '@/lib/api'

interface BookCardProps {
  book: Book
  variant?: 'default' | 'large'
}

const BookCard: React.FC<BookCardProps> = ({ book, variant = 'default' }) => {
  const [duration, setDuration] = useState<string>('')
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (book.audioLink) {
      getAudioDuration(book.audioLink)
        .then((seconds) => {
          setDuration(formatDuration(seconds))
        })
        .catch(() => {
          // If audio duration fails, show approximate reading time
          setDuration('5 min read')
        })
    }
  }, [book.audioLink])

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="book__star book__star--filled">★</span>
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="book__star book__star--half">★</span>
        )
      } else {
        stars.push(
          <span key={i} className="book__star">★</span>
        )
      }
    }

    return stars
  }

  if (variant === 'large') {
    return (
      <Link href={`/book/${book.id}`} className="selected-book">
        <div className="selected-book__content">
          <div className="selected-book__image-wrapper">
            <Image 
              src={imageError || !book.imageLink ? "/assets/logo.png" : book.imageLink} 
              alt={`${book.title} by ${book.author} - Book cover`}
              className="selected-book__image"
              width={120}
              height={160}
              quality={90}
              loading="lazy"
              sizes="(max-width: 768px) 120px, 160px"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyziw3yOWSvADU7f5P7pwr8+z6aH/Z"
              onError={() => setImageError(true)}
            />
            {book.subscriptionRequired && (
              <div className="book__premium-pill">Premium</div>
            )}
          </div>
          <div className="selected-book__info">
            <div className="selected-book__subtitle">Book of the day</div>
            <h3 className="selected-book__title">{book.title}</h3>
            <div className="selected-book__author">{book.author}</div>
            <div className="selected-book__description">
              {book.bookDescription || book.subTitle}
            </div>
            <div className="selected-book__details">
              {duration && <div className="book__duration">{duration}</div>}
              <div className="book__rating">
                <span className="book__rating--number">{book.averageRating}</span>
                <div className="book__stars">
                  {renderStars(book.averageRating)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/book/${book.id}`} className="book__card">
      <div className="book__card--wrapper">
        <div className="book__image--wrapper">
          <Image 
            src={imageError || !book.imageLink ? "/assets/logo.png" : book.imageLink} 
            alt={`${book.title} by ${book.author} - Book cover`}
            className="book__image"
            width={120}
            height={160}
            quality={90}
            loading="lazy"
            sizes="(max-width: 768px) 120px, 160px"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyziw3yOWSvADU7f5P7pwr8+z6aH/Z"
            onError={() => setImageError(true)}
          />
          {book.subscriptionRequired && (
            <div className="book__premium-pill">Premium</div>
          )}
        </div>
        <div className="book__content">
          <div className="book__title">{book.title}</div>
          <div className="book__author">{book.author}</div>
          <div className="book__subtitle">{book.subTitle}</div>
          <div className="book__details">
            {duration && <div className="book__duration">{duration}</div>}
            <div className="book__rating">
              <span className="book__rating--number">{book.averageRating}</span>
              <div className="book__stars">
                {renderStars(book.averageRating)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BookCard