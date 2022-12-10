import React from 'react'
import { useRecoilValue } from 'recoil'
import { currentNodeState, isSearchingState } from '../../../global/Atoms'
import { IFolderNode, INode } from '../../../types'
import { FolderContent } from './FolderContent'
import { ImageContent } from './ImageContent'
import './NodeContent.scss'
import { TextContent } from './TextContent'
import { RestaurantContent } from './RestaurantContent'
import { SearchContent } from './SearchContent'

/** Props needed to render any node content */

export interface INodeContentProps {
  childNodes?: INode[]
  onCreateNodeButtonClick: () => void
}

/**
 * This is the node content.
 *
 * @param props: INodeContentProps
 * @returns Content that any type of node renders
 */
export const NodeContent = (props: INodeContentProps) => {
  const { onCreateNodeButtonClick, childNodes } = props
  const currentNode = useRecoilValue(currentNodeState)
  const isSearching = useRecoilValue(isSearchingState)
  if (isSearching) {
    return <SearchContent />
  }
  switch (currentNode.type) {
    case 'image':
      return <ImageContent />
    case 'text':
      return <TextContent />
    case 'restaurant':
      return <RestaurantContent />
    case 'folder':
      if (childNodes) {
        return (
          <FolderContent
            node={currentNode as IFolderNode}
            onCreateNodeButtonClick={onCreateNodeButtonClick}
            childNodes={childNodes}
          />
        )
      }
  }
  return null
}
