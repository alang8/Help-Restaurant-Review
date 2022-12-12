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
import { WriteReplyModal } from '../../../Modals/WriteReplyModal'
import Reply from './Reply'
import { Button } from '../../../Button'
import Reply2 from './Reply2'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

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

  const formatDate = (date: string) => {
    const dateObj = new Date(date)
    const time = dateObj.toLocaleTimeString()
    const day = dateObj.toLocaleDateString()
    return `${day} at ${time}`
  }

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
  }, [currentNode, refresh])

  useEffect(() => {
    // Make API call to get the coordinates of the restaurant
    const getCoordinates = async () => {
      const resp = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?
        country=us&autocomplete=false&limit=1&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
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
        zoom: 10,
      })
      setMarker({
        longitude: coordinates[0],
        latitude: coordinates[1],
      })
    }
    getCoordinates()
  }, [currentNode, refresh])

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
            style={{ width: '100%', height: '50vh' }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken="pk.eyJ1IjoiYW5kcmV3c2xpIiwiYSI6ImNsYms1cGplMDBiMmkzc3F2aDFjendmMzIifQ.Y1fKkQtlBerceH_I6Eo2Xw"
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
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Google_Maps_pin.svg/1200px-Google_Maps_pin.svg.png" />
              </Marker>
            )}
          </Map>
        </div>
        <div className="itemThree">
          <div className="sectionDivider" />
          <h1 className="sectionTitle">&#128302; Hours</h1>
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
          <h1 className="sectionTitle">&#129497; Contact Us</h1>
          <p>{phoneNumber}</p>
          <div>{email}</div>
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
            // If there are no reviews, display a message
            restaurantReviews.length === 0 ? (
              <div className="reviewContainerEmptyState">
                There are no reviews for this restaurant yet. Leave the first review!
              </div>
            ) : (
              restaurantReviews.map((review, idx) => {
                return (
                  <React.Fragment key={idx}>
                    <Reply
                      review={review}
                      setParentReview={setParentReview}
                      setWriteReplyModal={setWriteReplyModal}
                      key={idx}
                    />
                    {review.replies.map((replyId, idx) => {
                      return (
                        <Reply2
                          reviewId={replyId}
                          setParentReview={setParentReview}
                          setWriteReplyModal={setWriteReplyModal}
                          key={idx}
                        />
                      )
                    })}
                  </React.Fragment>
                )
              })
            )
          }
        </div>
      </div>
    </div>
  )
}
