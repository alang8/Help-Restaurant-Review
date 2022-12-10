import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  refreshState,
  currentNodeState,
  selectedParentReviewState,
} from '../../../../global/Atoms'
import './RestaurantContent.scss'
import { FrontendReviewGateway } from '../../../../reviews/FrontendReviewGateway'
import { IReview } from '../../../../types'
import { Button } from '../../../Button'
import { WriteReplyModal } from '../../../Modals/WriteReplyModal'

/** The content of an image node, including any anchors */
export const RestaurantContent = () => {
  // recoil state management
  const currentNode = useRecoilValue(currentNodeState)
  const refresh = useRecoilValue(refreshState)
  const [, setParentReview] = useRecoilState(selectedParentReviewState)

  // destructure content for a restaurant node
  const { location, description, phoneNumber, email, rating, reviews } =
    currentNode.content
  const { mon, tue, wed, thu, fri, sat, sun } = currentNode.content.hours

  // state for reviews
  const [restaurantReviews, setRestaurantReviews] = useState<IReview[]>(reviews)

  // modal state
  const [writeReplyModal, setWriteReplyModal] = useState(false)

  const reviewButtonStyle = {
    height: 30,
    width: 100,
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '1px solid #000000',
    fontWeight: 'bold',
  }

  const formatDate = (date: string) => {
    const dateObj = new Date(date)
    const time = dateObj.toLocaleTimeString()
    const day = dateObj.toLocaleDateString()
    return `${day} at ${time}`
  }

  useEffect(() => {
    // Get the reviews for the restaurant
    const getReviews = async () => {
      const reviewResp = await FrontendReviewGateway.getReviewsByNodeId(
        currentNode.nodeId
      )
      if (!reviewResp.success) {
        console.log('Error getting reviews: ' + reviewResp.message)
      }
      const reviews = reviewResp.payload!
      setRestaurantReviews(reviews)
    }
    getReviews()
  }, [currentNode, refresh])

  return (
    <div className="restaurantContainer">
      <div className="gridColOne">
        <div className="itemOne">
          <h1 className="sectionTitle">Description</h1>
          <p>{description}</p>
        </div>
        <div className="itemTwo">
          <div className="sectionDivider" />
          <h1 className="sectionTitle">Location</h1>
          {location}
        </div>
        <div className="itemThree">
          <div className="sectionDivider" />
          <h1 className="sectionTitle">Hours</h1>
          <ul className="hoursContainer">
            <li>
              <strong>Mon</strong> {mon.start} - {mon.end}
            </li>
            <li>
              <strong>Tue</strong> {tue.start} - {tue.end}
            </li>
            <li>
              <strong>Wed</strong> {wed.start} - {wed.end}
            </li>
            <li>
              <strong>Thu</strong> {thu.start} - {thu.end}
            </li>
            <li>
              <strong>Fri</strong> {fri.start} - {fri.end}
            </li>
            <li>
              <strong>Sat</strong> {sat.start} - {sat.end}
            </li>
            <li>
              <strong>Sun</strong> {sun.start} - {sun.end}
            </li>
          </ul>
        </div>
        <div className="itemFour">
          <div className="sectionDivider" />
          <h1 className="sectionTitle">Contact Us</h1>
          <p>{phoneNumber}</p>
          <div>{email}</div>
        </div>
      </div>
      <div className="gridColTwo">
        <h1 className="sectionTitle">Reviews</h1>
        <WriteReplyModal
          isOpen={writeReplyModal}
          onClose={() => setWriteReplyModal(false)}
        />
        <div className="scrollable">
          {
            // If there are no reviews, display a message
            restaurantReviews.length === 0 ? (
              <div className="reviewContainerEmptyState">
                There are no reviews for this restaurant yet. Leave the first review!
              </div>
            ) : (
              restaurantReviews.map((review, idx) => {
                return (
                  <div className="reviewContainer" key={idx}>
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
              })
            )
          }
          {/* {restaurantReviews.map((review, idx) => {
            return (
              <div className="reviewContainer" key={idx}>
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
          })} */}
        </div>
      </div>
    </div>
  )
}
