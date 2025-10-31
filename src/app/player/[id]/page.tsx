'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthProvider'
import { getBookById } from '@/lib/api'
import { Book } from '@/types/book'
import { AiOutlineClockCircle, AiFillPlayCircle, AiFillPauseCircle } from 'react-icons/ai'
import { BiSkipPrevious, BiSkipNext, BiVolumeFull } from 'react-icons/bi'
import { BsSpeedometer2 } from 'react-icons/bs'

export default function PlayerPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)

  const bookId = params.id as string

  const loadBook = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const bookData = await getBookById(bookId)
      setBook(bookData)
    } catch (err) {
      console.error('Error loading book:', err)
      setError('Failed to load book. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [bookId])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
      return
    }
    
    if (bookId && user) {
      loadBook()
    }
  }, [bookId, user, authLoading, loadBook, router])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', onEnded)
    }
  }, [book])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    const newVolume = parseFloat(e.target.value) / 100
    
    if (audio) {
      audio.volume = newVolume
    }
    setVolume(newVolume)
  }

  const handleSpeedChange = (newRate: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.playbackRate = newRate
    }
    setPlaybackRate(newRate)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const skipTime = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  if (authLoading) {
    return <div className="player__loading">Loading...</div>
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="player__container">
        <div className="player__loading">Loading book...</div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="player__container">
        <div className="player__error">
          <h2>Book Not Available</h2>
          <p>{error || 'The book you are looking for is not available for playback.'}</p>
          <button onClick={() => router.push('/for-you')} className="btn">
            Back to For You
          </button>
        </div>
      </div>
    )
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="player__container">
      <div className="player__wrapper">
        {/* Audio element */}
        {book.audioLink && (
          <audio
            ref={audioRef}
            src={book.audioLink}
            onLoadedMetadata={() => {
              if (audioRef.current) {
                setDuration(audioRef.current.duration)
              }
            }}
          />
        )}

        {/* Header */}
        <div className="player__header">
          <button 
            onClick={() => router.back()} 
            className="player__back-btn"
          >
            ← Back
          </button>
          <h1 className="player__title">{book.title}</h1>
        </div>

        {/* Main content */}
        <div className="player__content">
          {/* Book summary */}
          <div className="player__summary">
            <div className="player__summary-header">
              <h2>Summary</h2>
              <div className="player__meta">
                <AiOutlineClockCircle />
                <span>By {book.author}</span>
              </div>
            </div>
            
            <div className="player__summary-content">
              <p style={{ whiteSpace: 'pre-line' }}>
                {book.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Audio player controls */}
        <div className="player__controls">
          <div className="player__progress">
            <span className="player__time">{formatTime(currentTime)}</span>
            <div className="player__progress-container">
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercentage}
                onChange={handleSeek}
                className="player__progress-bar"
                aria-label="Audio progress"
                title="Seek audio position"
              />
            </div>
            <span className="player__time">{formatTime(duration)}</span>
          </div>

          <div className="player__buttons">
            <button
              onClick={() => skipTime(-10)}
              className="player__control-btn player__control-btn--small"
            >
              <BiSkipPrevious />
              <span>10s</span>
            </button>

            <button
              onClick={togglePlayPause}
              className="player__control-btn player__control-btn--play"
              disabled={!book.audioLink}
            >
              {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
            </button>

            <button
              onClick={() => skipTime(10)}
              className="player__control-btn player__control-btn--small"
            >
              <BiSkipNext />
              <span>10s</span>
            </button>
          </div>

          <div className="player__options">
            {/* Speed control */}
            <div className="player__speed">
              <BsSpeedometer2 />
              <select
                value={playbackRate}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="player__speed-select"
                aria-label="Playback speed"
                title="Select playback speed"
              >
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>

            {/* Volume control */}
            <div className="player__volume">
              <BiVolumeFull />
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={handleVolumeChange}
                className="player__volume-slider"
                aria-label="Volume control"
                title="Adjust volume"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}