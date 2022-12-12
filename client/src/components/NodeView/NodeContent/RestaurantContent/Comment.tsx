import React, { useEffect, useState } from 'react'
import { IReview } from '../../../../types'
import { FrontendReviewGateway } from '../../../../reviews/FrontendReviewGateway'
import { Button } from '../../../Button'

interface IProps {
  reviewId: string
  depth: number
  setParentReview(reviewId: string): void
  setWriteReplyModal(modal: boolean): void
}

export default function Comment({
  reviewId,
  depth,
  setParentReview,
  setWriteReplyModal,
}: IProps) {
  const formatDate = (date: string) => {
    const dateObj = new Date(date)
    const time = dateObj.toLocaleTimeString()
    const day = dateObj.toLocaleDateString()
    return `${day} at ${time}`
  }

  const reviewButtonStyle = {
    height: 30,
    width: 100,
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #000000',
    fontWeight: 'bold',
  }
  const [review, setRestaurantReview] = useState<IReview | null>(null)
  useEffect(() => {
    // Get the reviews for the restaurant
    const getReviews = async () => {
      console.log(reviewId)
      const reviewResp = await FrontendReviewGateway.getReviewById(reviewId)
      if (!reviewResp.success) {
        console.log('Error getting reviews: ' + reviewResp.message)
      }
      const review = reviewResp.payload!
      setRestaurantReview(review)
    }
    getReviews()
  }, [])
  return (
    <div className="reply-container" style={{ paddingLeft: 30 * depth }}>
      <img src="https://tinyurl.com/4ttx78fw" />
      <div className="reviewContainer reply">
        <div className="reviewTitleBar">
          <img src="/anonymous.png" alt="anonymous" />
          <strong>{review?.author}</strong>
        </div>
        <div className="reviewContent">{review?.content}</div>
        <div className="reviewFooter">
          <p>Last Modified: {formatDate(String(review?.dateModified!))}</p>
          <Button
            text="Reply"
            style={reviewButtonStyle}
            onClick={() => {
              setParentReview(review!.reviewId)
              setWriteReplyModal(true)
            }}
          />
        </div>
      </div>
    </div>
  )
}
