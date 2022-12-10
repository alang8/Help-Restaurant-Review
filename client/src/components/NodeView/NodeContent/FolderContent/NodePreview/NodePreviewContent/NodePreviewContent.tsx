import React from 'react'
import { NodeType } from '../../../../../../types'
import { ImagePreviewContent } from './ImagePreviewContent'
import { TextPreviewContent } from './TextPreviewContent'
import { RestaurantPreviewContent } from './RestaurantPreviewContent'
import { FolderPreviewContent } from './FolderPreviewContent'
import './NodePreviewContent.scss'

/** Props needed to render any node content */
export interface INodeContentPreviewProps {
  content: any
  type: NodeType
}

export const NodePreviewContent = (props: INodeContentPreviewProps) => {
  const { type, content } = props
  switch (type) {
    case 'image':
      return <ImagePreviewContent content={content} />
    case 'text':
      return <TextPreviewContent content={content} />
    case 'restaurant':
      return <RestaurantPreviewContent content={content} />
    case 'folder':
      return <FolderPreviewContent content={content} />
    default:
      return null
  }
}
