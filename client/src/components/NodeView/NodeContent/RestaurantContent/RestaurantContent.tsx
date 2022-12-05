import React from 'react'
import { useRecoilValue } from 'recoil'
import { currentNodeState } from '../../../../global/Atoms'
import './RestaurantContent.scss'

/** The content of an image node, including any anchors */
export const RestaurantContent = () => {
  // recoil state management
  const currentNode = useRecoilValue(currentNodeState)

  // destructure content for a restaurant node
  // eslint-disable-next-line
  const { location, description, phoneNumber, email, rating, reviews } =
    currentNode.content
  const { mon, tue, wed, thu, fri, sat, sun } = currentNode.content.hours

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
        <p>{reviews}</p>
      </div>
    </div>
  )
}
