import React from 'react'
import './RestaurantPreviewContent.scss'

interface IRestaurantPreviewProps {
  content: any
}

/** The content of an image node, including any anchors */
export const RestaurantPreviewContent = (props: IRestaurantPreviewProps) => {
  const { content } = props
  /**
   * Return the preview container if we are rendering a restaurant preview
   */
  return (
    <div className="restaurantContent-preview">
      <img src={content.imageContent} alt="Restaurant preview" />
    </div>
  )
}
