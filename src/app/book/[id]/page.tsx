'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '../../../lib/AuthProvider'
import { useAuthModal } from '../../../store/useAuthModal'
import { getBookById } from '../../../lib/api'
import { Book } from '../../../types/book'
import SkeletonLoader from '@/componenets/SkeletonLoader'
import { AiFillStar, AiOutlineUser, AiOutlineTag, AiOutlineClockCircle } from 'react-icons/ai'
import { BiBookOpen, BiHeadphone } from 'react-icons/bi'
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs'

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { openModal } = useAuthModal()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const bookId = params.id as string

  const loadBook = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const bookData = await getBookById(bookId)
      setBook(bookData)
    } catch (err) {
      console.error('Error loading book:', err)
      setError('Failed to load book details. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [bookId])

  useEffect(() => {
    if (bookId) {
      loadBook()
    }
  }, [bookId, loadBook])

  const handleReadOrListen = () => {
    if (!user) {
      openModal('login')
      return
    }

    // Check if book requires subscription (we'll implement subscription checking later)
    if (book?.subscriptionRequired) {
      // For now, redirect to choose-plan page
      router.push('/choose-plan')
      return
    }

    // Navigate to player page
    router.push(`/player/${bookId}`)
  }

  const handleBookmark = () => {
    if (!user) {
      openModal('login')
      return
    }

    // Toggle bookmark state (we'll implement actual saving later)
    setIsBookmarked(!isBookmarked)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <AiFillStar key={i} className="book__star book__star--filled" />
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <AiFillStar key={i} className="book__star book__star--half" />
        )
      } else {
        stars.push(
          <AiFillStar key={i} className="book__star" />
        )
      }
    }

    return stars
  }

  if (loading) {
    return (
      <div className="book-detail__container">
        <div className="book-detail__content">
          <SkeletonLoader variant="book-card" count={1} />
          <div className="book-detail__skeleton">
            <SkeletonLoader variant="list-item" count={5} />
          </div>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="book-detail__container">
        <div className="book-detail__error">
          <h2>Book Not Found</h2>
          <p>{error || 'The book you are looking for could not be found.'}</p>
          <button onClick={() => router.push('/for-you')} className="btn">
            Back to For You
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="book-detail__container">
      <div className="book-detail__content">
        <div className="book-detail__header">
          <div className="book-detail__image-wrapper">
            <Image
              src={imageError ? "/assets/logo.png" : book.imageLink}
              alt={book.title}
              width={300}
              height={400}
              className="book-detail__image"
              onError={() => setImageError(true)}
            />
            {book.subscriptionRequired && (
              <div className="book__premium-pill book__premium-pill--large">Premium</div>
            )}
          </div>

          <div className="book-detail__info">
            <div className="book-detail__subtitle">{book.subTitle}</div>
            <h1 className="book-detail__title">{book.title}</h1>
            <div className="book-detail__author">
              <AiOutlineUser />
              <span>{book.author}</span>
            </div>

            <div className="book-detail__rating">
              <div className="book__stars">
                {renderStars(book.averageRating)}
              </div>
              <span className="book__rating--number">
                {book.averageRating} ({book.totalRating} ratings)
              </span>
            </div>

            <div className="book-detail__meta">
              <div className="book-detail__meta-item">
                <AiOutlineClockCircle />
                <span>13-minute read</span>
              </div>
              <div className="book-detail__meta-item">
                <AiOutlineTag />
                <span>{book.type}</span>
              </div>
              <div className="book-detail__meta-item">
                <span>{book.keyIdeas} Key Ideas</span>
              </div>
            </div>

            <div className="book-detail__actions">
              <button
                onClick={handleReadOrListen}
                className="btn book-detail__action-btn"
              >
                <BiBookOpen />
                Read
              </button>
              <button
                onClick={handleReadOrListen}
                className="btn book-detail__action-btn"
              >
                <BiHeadphone />
                Listen
              </button>
              <button
                onClick={handleBookmark}
                className="btn book-detail__bookmark-btn"
              >
                {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}
                {isBookmarked ? 'Bookmarked' : 'Add to My Library'}
              </button>
            </div>

            {book.tags && book.tags.length > 0 && (
              <div className="book-detail__tags">
                {book.tags.map((tag, index) => (
                  <span key={index} className="book-detail__tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="book-detail__description">
            <h2>What&apos;s it about?</h2>
          <div className="book-detail__description-content">
            <h3>Book Description</h3>
            <p>{book.bookDescription}</p>
            
            <h3>About the Author</h3>
            <p>{book.authorDescription}</p>
          </div>
        </div>
      </div>
    </div>
  )
}