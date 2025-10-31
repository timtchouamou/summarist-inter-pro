'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/AuthProvider'
import { signOut } from '../../lib/supabaseAuth'
import { getSelectedBook, getRecommendedBooks, getSuggestedBooks } from '@/lib/api'
import { Book } from '../../types/book'
import BookCard from '@/componenets/BookCard'
import BookFeatureCard from '@/componenets/BookFeatureCard'
import SkeletonLoader from '@/componenets/SkeletonLoader'

export default function ForYouPage() {

  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([])
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([])
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadBooks()
    }
  }, [user])

  const loadBooks = async () => {
    try {
      setLoadingBooks(true)
      setError(null)

      const [selected, recommended, suggested] = await Promise.all([
        getSelectedBook(),
        getRecommendedBooks(),
        getSuggestedBooks()
      ])

      setSelectedBook(selected)
      setRecommendedBooks(recommended)
      setSuggestedBooks(suggested)
    } catch (err) {
      console.error('Error loading books:', err)
      setError('Failed to load books. Please try again later.')
    } finally {
      setLoadingBooks(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="for-you__container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="for-you__container">
      <header className="for-you__header">
        <h1>Welcome to Summarist!</h1>
        <div className="for-you__user-info">
          <span>Logged in as: {user.email}</span>
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        </div>
      </header>
      
      <main className="for-you__main">
        {error && (
          <div className="error-message" style={{ 
            backgroundColor: '#fee', 
            color: '#c33', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div className="for-you__section">
          {loadingBooks ? (
            <SkeletonLoader variant="selected-book" count={1} />
          ) : selectedBook ? (
            <BookFeatureCard book={selectedBook} />
          ) : (
            <div className="loading">No selected book available.</div>
          )}
        </div>
        <div className="for-you__section">
          <div>
          <h2 className="for-you__section--title">Recommended For You </h2>
          <span>We think you'll like these</span> 
          </div>
         

          <div className="books__grid">
            {loadingBooks ? (
              <SkeletonLoader variant="book-card" count={8} />
            ) : recommendedBooks.length > 0 ? (
              recommendedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <div className="loading">No recommended books available.</div>
            )}
          </div>
        </div>

        <div className="for-you__section">
          <h2 className="for-you__section--title">Suggested Books</h2>
          <div className="books__grid">
            {loadingBooks ? (
              <SkeletonLoader variant="book-card" count={8} />
            ) : suggestedBooks.length > 0 ? (
              suggestedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))
            ) : (
              <div className="loading">No suggested books available.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}