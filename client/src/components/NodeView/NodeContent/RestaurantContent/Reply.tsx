import React from 'react'
import { IReview } from '../../../../types'
import { Button } from '../../../Button'

interface IProps {
  review: IReview
  depth: number
  setParentReview(reviewId: string): void
  setWriteReplyModal(modal: boolean): void
}

export default function Reply({
  review,
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
  // Recursively build the reply tree while the review.replies array is not empty
  // if (review.replies.length > 0) {
  //   return (
  //     <div className="reviewContainer">
  //       <div className="reviewTitleBar">
  //         <img src="/anonymous.png" alt="anonymous" />
  //         <strong>{review.author}</strong>
  //       </div>
  //       <div className="reviewContent">{review.content}</div>
  //       <div className="reviewFooter">
  //         <p>Last Modified: {formatDate(String(review.dateModified!))}</p>
  //         <Button
  //           text="Reply"
  //           style={reviewButtonStyle}
  //           onClick={() => {
  //             setParentReview(review.reviewId)
  //             setWriteReplyModal(true)
  //           }}
  //         />
  //       </div>
  //       {review.replies.map((reply) => (
  //         <Reply
  //           review={reply}
  //           setParentReview={setParentReview}
  //           setWriteReplyModal={setWriteReplyModal}
  //           key={reply.reviewId}
  //         />
  //       ))}
  //     </div>
  //   )
  // }

  return (
    <div className="reviewContainer">
      <div className="reviewTitleBar">
        <img src="/anonymous.png" alt="anonymous" />
        <strong>{review.author}</strong>
      </div>
      <div className="reviewContent">{review.content}</div>
      <div className="reviewFooter">
        <p>Last Modified: {formatDate(String(review.dateModified!))}</p>
        <Button
          text="Reply"
          style={reviewButtonStyle}
          onClick={() => {
            setParentReview(review.reviewId)
            setWriteReplyModal(true)
          }}
        />
      </div>
    </div>
  )
}
