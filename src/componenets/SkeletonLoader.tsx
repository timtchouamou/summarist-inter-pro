import React from 'react'

interface SkeletonLoaderProps {
  variant?: 'book-card' | 'selected-book' | 'list-item'
  count?: number
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ variant = 'book-card', count = 1 }) => {
  const renderBookCardSkeleton = () => (
    <div className="skeleton__book-card">
      <div className="skeleton__book-image"></div>
      <div className="skeleton__book-content">
        <div className="skeleton__line skeleton__line--title"></div>
        <div className="skeleton__line skeleton__line--author"></div>
        <div className="skeleton__line skeleton__line--subtitle"></div>
        <div className="skeleton__book-details">
          <div className="skeleton__line skeleton__line--duration"></div>
          <div className="skeleton__line skeleton__line--rating"></div>
        </div>
      </div>
    </div>
  )

  const renderSelectedBookSkeleton = () => (
    <div className="skeleton__selected-book">
      <div className="skeleton__selected-book-image"></div>
      <div className="skeleton__selected-book-content">
        <div className="skeleton__line skeleton__line--subtitle"></div>
        <div className="skeleton__line skeleton__line--large-title"></div>
        <div className="skeleton__line skeleton__line--author"></div>
        <div className="skeleton__line skeleton__line--description-1"></div>
        <div className="skeleton__line skeleton__line--description-2"></div>
      </div>
    </div>
  )

  const renderListItemSkeleton = () => (
    <div className="skeleton__list-item">
      <div className="skeleton__line skeleton__line--full"></div>
    </div>
  )

  const renderSkeleton = () => {
    switch (variant) {
      case 'selected-book':
        return renderSelectedBookSkeleton()
      case 'list-item':
        return renderListItemSkeleton()
      default:
        return renderBookCardSkeleton()
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton__wrapper">
          {renderSkeleton()}
        </div>
      ))}
    </>
  )
}

export default SkeletonLoader