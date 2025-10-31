'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/AuthProvider'
import { useAuthModal } from '../../store/useAuthModal'
import { Book } from '../../types/book'
import BookCard from '@/componenets/BookCard'
import SkeletonLoader from '@/componenets/SkeletonLoader'
import { AiOutlineBook, AiOutlineCheckCircle, AiOutlineHeart, AiOutlineDelete } from 'react-icons/ai'
import { BiLibrary } from 'react-icons/bi'

interface LibraryBook extends Omit<Book, 'status'> {
  libraryStatus: 'saved' | 'completed' | 'in-progress'
  savedAt: string
  completedAt?: string
  progress?: number // 0-100 for in-progress books
}

export default function LibraryPage() {
  const { user, loading } = useAuth()
  const { openModal } = useAuthModal()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState<'saved' | 'completed' | 'in-progress'>('saved')
  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>([])
  const [loadingBooks, setLoadingBooks] = useState(true)

  // Mock library data - in real app this would come from Supabase
  const mockLibraryBooks: LibraryBook[] = [
    {
      id: "1",
      title: "Atomic Habits",
      author: "James Clear",
      subTitle: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
      imageLink: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1535115320/40121378.jpg",
      bookDescription: "No matter your goals, Atomic Habits offers a proven framework for improving--every day.",
      summary: "Atomic Habits is the most comprehensive guide on how to change your habits and improve your life.",
      audioLink: "https://cdn.pixabay.com/audio/2024/03/07/audio_123456.mp3",
      totalRating: 1200,
      averageRating: 4.8,
      keyIdeas: 5,
      type: "audio & text",
      subscriptionRequired: false,
      libraryStatus: "saved",
      savedAt: "2024-01-15T10:30:00Z",
      authorDescription: "James Clear is an author and speaker focused on habits and decision making.",
      tags: ["Self-Help", "Productivity", "Psychology"]
    },
    {
      id: "2", 
      title: "Think and Grow Rich",
      author: "Napoleon Hill",
      subTitle: "The Landmark Bestseller Now Revised and Updated",
      imageLink: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1463241782/30186948.jpg",
      bookDescription: "Think and Grow Rich has been called the &apos;Granddaddy of All Motivational Literature.&apos;",
      summary: "The original and best guide to achieving success and wealth through the power of thought.",
      audioLink: "https://cdn.pixabay.com/audio/2024/03/07/audio_789012.mp3",
      totalRating: 892,
      averageRating: 4.2,
      keyIdeas: 13,
      type: "audio & text",
      subscriptionRequired: true,
      libraryStatus: "completed",
      savedAt: "2024-01-10T14:20:00Z",
      completedAt: "2024-01-18T16:45:00Z",
      authorDescription: "Napoleon Hill was an American self-help author.",
      tags: ["Business", "Success", "Motivation"]
    },
    {
      id: "3",
      title: "The 7 Habits of Highly Effective People", 
      author: "Stephen R. Covey",
      subTitle: "Powerful Lessons in Personal Change",
      imageLink: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1421842784/36072.jpg",
      bookDescription: "The 7 Habits of Highly Effective People is a comprehensive program based on developing an awareness of how perceptions and assumptions hinder success.",
      summary: "Learn the seven habits that can transform your personal and professional effectiveness.",
      audioLink: "https://cdn.pixabay.com/audio/2024/03/07/audio_345678.mp3",
      totalRating: 654,
      averageRating: 4.5,
      keyIdeas: 7,
      type: "audio & text", 
      subscriptionRequired: false,
      libraryStatus: "in-progress",
      savedAt: "2024-01-20T09:15:00Z",
      progress: 65,
      authorDescription: "Stephen R. Covey was an American educator, author, businessman, and keynote speaker.",
      tags: ["Self-Help", "Leadership", "Personal Development"]
    }
  ]

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const loadLibraryBooks = useCallback(async () => {
    try {
      setLoadingBooks(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLibraryBooks(mockLibraryBooks)
    } catch (error) {
      console.error('Error loading library:', error)
    } finally {
      setLoadingBooks(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadLibraryBooks()
    }
  }, [user, loadLibraryBooks])

  const removeFromLibrary = async (bookId: string) => {
    try {
      // In real app, this would call API to remove book
      setLibraryBooks(prev => prev.filter(book => book.id !== bookId))
    } catch (error) {
      console.error('Error removing book from library:', error)
    }
  }

  const getFilteredBooks = () => {
    return libraryBooks.filter(book => book.libraryStatus === activeTab)
  }

  const getTabCount = (status: 'saved' | 'completed' | 'in-progress') => {
    return libraryBooks.filter(book => book.libraryStatus === status).length
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="library__container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="library__container">
        <div className="library__login-prompt">
          <BiLibrary className="library__login-icon" />
          <h2>Please log in to access your library</h2>
          <p>You need to be logged in to view your saved books and reading progress.</p>
          <button onClick={() => openModal('login')} className="btn">
            Login
          </button>
        </div>
      </div>
    )
  }

  const filteredBooks = getFilteredBooks()

  return (
    <div className="library__container">
      <div className="library__header">
        <div className="library__header-content">
          <BiLibrary className="library__header-icon" />
          <h1>My Library</h1>
        </div>
        <div className="library__stats">
          <span>{libraryBooks.length} total books</span>
        </div>
      </div>

      <div className="library__tabs">
        <button
          onClick={() => setActiveTab('saved')}
          className={`library__tab ${activeTab === 'saved' ? 'library__tab--active' : ''}`}
        >
          <AiOutlineHeart />
          <span>Saved ({getTabCount('saved')})</span>
        </button>
        
        <button
          onClick={() => setActiveTab('in-progress')}
          className={`library__tab ${activeTab === 'in-progress' ? 'library__tab--active' : ''}`}
        >
          <AiOutlineBook />
          <span>In Progress ({getTabCount('in-progress')})</span>
        </button>
        
        <button
          onClick={() => setActiveTab('completed')}
          className={`library__tab ${activeTab === 'completed' ? 'library__tab--active' : ''}`}
        >
          <AiOutlineCheckCircle />
          <span>Finished ({getTabCount('completed')})</span>
        </button>
      </div>

      <div className="library__content">
        {loadingBooks ? (
          <div className="books__grid">
            <SkeletonLoader variant="book-card" count={6} />
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="books__grid">
            {filteredBooks.map((book) => {
              // Convert LibraryBook to Book for BookCard component
              const bookForCard: Book = {
                ...book,
                status: 'selected' // Required by Book interface
              }
              
              return (
                <div key={book.id} className="library__book-wrapper">
                  <BookCard book={bookForCard} />
                  
                  <div className="library__book-info">
                    <div className="library__book-meta">
                      <span className="library__book-date">
                        {book.libraryStatus === 'completed' && book.completedAt 
                          ? `Completed ${formatDate(book.completedAt)}`
                          : `Saved ${formatDate(book.savedAt)}`
                        }
                      </span>
                      
                      {book.libraryStatus === 'in-progress' && book.progress && (
                        <div className="library__progress">
                          <div className="library__progress-bar">
                            <div 
                              className="library__progress-fill" 
                              style={{ width: `${book.progress}%` }}
                            />
                          </div>
                          <span className="library__progress-text">{book.progress}% complete</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => removeFromLibrary(book.id)}
                      className="library__remove-btn"
                      title="Remove from library"
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="library__empty">
            <div className="library__empty-content">
              {activeTab === 'saved' && (
                <>
                  <AiOutlineHeart className="library__empty-icon" />
                  <h3>No saved books yet</h3>
                  <p>Books you save for later will appear here. Start exploring and save books you want to read!</p>
                </>
              )}
              
              {activeTab === 'in-progress' && (
                <>
                  <AiOutlineBook className="library__empty-icon" />
                  <h3>No books in progress</h3>
                  <p>Books you&apos;re currently reading will appear here. Start reading a book to track your progress!</p>
                </>
              )}
              
              {activeTab === 'completed' && (
                <>
                  <AiOutlineCheckCircle className="library__empty-icon" />
                  <h3>No completed books yet</h3>
                  <p>Books you&apos;ve finished reading will appear here. Complete your first book to see it in this list!</p>
                </>
              )}
              
              <button 
                onClick={() => router.push('/for-you')} 
                className="btn library__explore-btn"
              >
                Explore Books
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}