import 'mapbox-gl/dist/mapbox-gl.css'
import React, { useEffect, useState } from 'react'
import Map, { Marker } from 'react-map-gl'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  currentNodeState,
  refreshLinkListState,
  refreshState,
  selectedParentReviewState,
} from '../../../../global/Atoms'
import { FrontendReviewGateway } from '../../../../reviews/FrontendReviewGateway'
import { IReview } from '../../../../types'
import { WriteReplyModal } from '../../../Modals/WriteReplyModal'
import Comment from './Comment'
import './RestaurantContent.scss'
import Review from './Review'

/** The content of an image node, including any anchors */
export const RestaurantContent = () => {
  // recoil state management
  const currentNode = useRecoilValue(currentNodeState)
  const refresh = useRecoilValue(refreshState)
  const [, setParentReview] = useRecoilState(selectedParentReviewState)

  // destructure content for a restaurant node
  const { location, description, phoneNumber, email, reviews } = currentNode.content
  const { mon, tue, wed, thu, fri, sat, sun } = currentNode.content.hours

  // state for reviews
  const [restaurantReviews, setRestaurantReviews] = useState<IReview[]>(reviews)
  const [reviewJSX, setReviewJSX] = useState<JSX.Element[]>([
    <div className="reviewContainerEmptyState" key={1}>
      There are no reviews for this restaurant yet. Leave the first review!
    </div>,
  ])

  // restaurant coordinates for map
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 10,
  })
  const [marker, setMarker] = useState({
    longitude: 0,
    latitude: 0,
  })

  // modal state
  const [writeReplyModal, setWriteReplyModal] = useState(false)

  useEffect(() => {
    // Get the root reviews for the restaurant
    const getReviews = async () => {
      const reviewResp = await FrontendReviewGateway.getReviewsByNodeId(
        currentNode.nodeId
      )
      if (!reviewResp.success) {
        console.log('Error getting reviews: ' + reviewResp.message)
      }
      let reviews = reviewResp.payload!
      reviews = reviews.filter((review) => review.parentReviewId === null)
      setRestaurantReviews(reviews)
    }
    getReviews()
  }, [currentNode, refresh, refreshLinkListState, setParentReview])

  useEffect(() => {
    // Make API call to get the coordinates of the restaurant
    const getCoordinates = async () => {
      const resp = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?country
        =us&autocomplete=false&limit=1&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
      )
      const data = await resp.json()
      if (data.features.length === 0) {
        setViewState({
          longitude: -100,
          latitude: 40,
          zoom: 3,
        })
        setMarker({
          longitude: -99999999,
          latitude: -99999999,
        })
        return
      }
      const coordinates = data.features[0].geometry.coordinates
      setViewState({
        longitude: coordinates[0],
        latitude: coordinates[1],
        zoom: 13,
      })
      setMarker({
        longitude: coordinates[0],
        latitude: coordinates[1],
      })
    }
    getCoordinates()
  }, [currentNode, refresh])

  // useEffect to build the reply and comment thread
  useEffect(() => {
    const buildCommentTree = async () => {
      const buildComments = async (reviewId: string, depth: number) => {
        const reviewResp = await FrontendReviewGateway.getReviewById(reviewId)
        if (!reviewResp.success) {
          console.log('Error getting review: ' + reviewResp.message)
          return
        }
        const review = reviewResp.payload!
        const children = await Promise.all(
          review.replies.map((replyId) => buildComments(replyId, depth + 1))
        )
        return (
          <React.Fragment key={reviewId}>
            <Comment
              reviewId={reviewId}
              depth={depth}
              setParentReview={setParentReview}
              setWriteReplyModal={setWriteReplyModal}
            />
            {children}
          </React.Fragment>
        )
      }

      const returnJSX = await Promise.all(
        restaurantReviews.map(async (review, idx) => {
          const comments = await Promise.all(
            review.replies.map((replyId) => buildComments(replyId, 1))
          )
          return (
            <React.Fragment key={idx}>
              <Review
                review={review}
                setParentReview={setParentReview}
                setWriteReplyModal={setWriteReplyModal}
                key={idx}
              />
              {comments}
            </React.Fragment>
          )
        })
      )
      setReviewJSX(returnJSX)
    }
    buildCommentTree()
  }, [restaurantReviews])

  // format the hours of operation
  const formatTime = (time: string) => {
    if (time === '00:00') {
      return '12 AM'
    } else if (time === '12:00') {
      return '12 PM'
    } else if (time > '12') {
      return Number(time.substring(0, 2)) - 12 + time.substring(2) + ' PM'
    } else {
      return time + ' AM'
    }
  }

  return (
    <div className="restaurantContainer">
      <div className="gridColOne">
        <div className="itemOne">
          <h1 className="sectionTitle">&#128512; Description</h1>
          {description}
        </div>
        <div className="itemTwo">
          <div className="sectionDivider" />
          <h1 className="sectionTitle">&#128205; Location</h1>
          {location}
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            style={{ width: '100%', height: '40vh' }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          >
            {marker.latitude === -99999999 && marker.longitude === -99999999 ? (
              <div />
            ) : (
              <Marker
                longitude={marker.longitude}
                latitude={marker?.latitude}
                anchor="bottom"
                style={{ width: 20, height: 20 }}
              >
                <img src="http://shorturl.at/cgjnM" />
              </Marker>
            )}
          </Map>
        </div>
        <div className="itemThree">
          <div className="sectionDivider" />
          <h1 className="sectionTitle">&#128302; Hours</h1>
          <ul className="hoursContainer">
            <li>
              <strong>Mon</strong>
              <p>
                {formatTime(mon.start)} - {formatTime(mon.end)}
              </p>
            </li>
            <li>
              <strong>Tue</strong>
              <p>
                {formatTime(tue.start)} - {formatTime(tue.end)}
              </p>
            </li>
            <li>
              <strong>Wed</strong>
              <p>
                {formatTime(wed.start)} - {formatTime(wed.end)}
              </p>
            </li>
            <li>
              <strong>Thu</strong>
              <p>
                {formatTime(thu.start)} - {formatTime(thu.end)}
              </p>
            </li>
            <li>
              <strong>Fri</strong>
              <p>
                {formatTime(fri.start)} - {formatTime(fri.end)}
              </p>
            </li>
            <li>
              <strong>Sat</strong>
              <p>
                {formatTime(sat.start)} - {formatTime(sat.end)}
              </p>
            </li>
            <li>
              <strong>Sun</strong>
              <p>
                {formatTime(sun.start)} - {formatTime(sun.end)}
              </p>
            </li>
          </ul>
        </div>
        <div className="itemFour">
          <div className="sectionDivider" />
          <h1 className="sectionTitle">&#129497; Contact Us</h1>
          <p>
            <strong>Phone Number: </strong>
            {phoneNumber}
          </p>
          <div>
            <strong>Email: </strong>
            {email}
          </div>
        </div>
      </div>
      <div className="gridColTwo">
        <h1 className="sectionTitle">Reviews ({restaurantReviews.length})</h1>
        <WriteReplyModal
          isOpen={writeReplyModal}
          onClose={() => setWriteReplyModal(false)}
        />
        <div className="scrollable">
          {
            // If there are no reviews, display an empty state
            restaurantReviews.length === 0 ? (
              <div className="reviewContainerEmptyState">
                There are no reviews for this restaurant yet. Leave the first review!
              </div>
            ) : (
              reviewJSX
            )
          }
        </div>
      </div>
    </div>
  )
}
