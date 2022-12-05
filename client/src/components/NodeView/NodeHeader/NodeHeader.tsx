import React, { useEffect, useState } from 'react'
import * as ai from 'react-icons/ai'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  alertMessageState,
  alertOpenState,
  alertTitleState,
  currentNodeState,
  isLinkingState,
  refreshLinkListState,
  refreshState,
  selectedNodeState,
} from '../../../global/Atoms'
import { FrontendNodeGateway } from '../../../nodes'
import { INode, INodeProperty, makeINodeProperty } from '../../../types'
import { Button } from '../../Button'
import { ContextMenuItems } from '../../ContextMenu'
import { EditableText } from '../../EditableText'
import './NodeHeader.scss'

interface INodeHeaderProps {
  onCreateNodeButtonClick: () => void
  onDeleteButtonClick: (node: INode) => void
  onMoveButtonClick: (node: INode) => void
  onHandleStartLinkClick: () => void
  onHandleCompleteLinkClick: () => void
  onOpenGraphClick: () => void
  onReviewButtonClick: () => void
}

export const NodeHeader = (props: INodeHeaderProps) => {
  const { onCreateNodeButtonClick, onReviewButtonClick } = props
  const currentNode = useRecoilValue(currentNodeState)
  const [refresh, setRefresh] = useRecoilState(refreshState)
  const isLinking = useRecoilValue(isLinkingState)
  const setSelectedNode = useSetRecoilState(selectedNodeState)
  const setAlertIsOpen = useSetRecoilState(alertOpenState)
  const setAlertTitle = useSetRecoilState(alertTitleState)
  const setAlertMessage = useSetRecoilState(alertMessageState)
  const [refreshLinkList, setRefreshLinkList] = useRecoilState(refreshLinkListState)

  // State variable for current node title
  const [title, setTitle] = useState(currentNode.title)
  // State variable for whether the title is being edited
  const [editingTitle, setEditingTitle] = useState<boolean>(false)

  /* Method to update the current folder view */
  // eslint-disable-next-line
  const handleUpdateFolderView = async (e: React.ChangeEvent) => {
    const nodeProperty: INodeProperty = makeINodeProperty(
      'viewType',
      (e.currentTarget as any).value as any
    )
    const updateViewResp = await FrontendNodeGateway.updateNode(currentNode.nodeId, [
      nodeProperty,
    ])
    if (updateViewResp.success) {
      setSelectedNode(updateViewResp.payload)
    } else {
      setAlertIsOpen(true)
      setAlertTitle('View not updated')
      setAlertMessage(updateViewResp.message)
    }
  }

  /* Method to update the node title */
  const handleUpdateTitle = async (title: string) => {
    setTitle(title)
    const nodeProperty: INodeProperty = makeINodeProperty('title', title)
    const titleUpdateResp = await FrontendNodeGateway.updateNode(currentNode.nodeId, [
      nodeProperty,
    ])
    if (!titleUpdateResp.success) {
      setAlertIsOpen(true)
      setAlertTitle('Title update failed')
      setAlertMessage(titleUpdateResp.message)
    }
    setRefresh(!refresh)
    setRefreshLinkList(!refreshLinkList)
  }

  /* Method called on title right click */
  const handleTitleRightClick = () => {
    ContextMenuItems.splice(0, ContextMenuItems.length)
    const menuItem: JSX.Element = (
      <div
        key={'titleRename'}
        className="contextMenuItem"
        onClick={(e) => {
          ContextMenuItems.splice(0, ContextMenuItems.length)
          setEditingTitle(true)
        }}
      >
        <div className="itemTitle">Rename</div>
        <div className="itemShortcut">ctrl + shift + R</div>
      </div>
    )
    ContextMenuItems.push(menuItem)
  }

  /* useEffect which updates the title and editing state when the node is changed */
  useEffect(() => {
    setTitle(currentNode.title)
    setEditingTitle(false)
  }, [currentNode])

  /* Node key handlers*/
  const nodeKeyHandlers = (e: KeyboardEvent) => {
    // keyboard shortcuts
    // key handlers with no modifiers
    switch (e.key) {
      case 'Enter':
        if (editingTitle == true) {
          e.preventDefault()
          setEditingTitle(false)
        }
        break
      case 'Escape':
        if (editingTitle == true) {
          e.preventDefault()
          setEditingTitle(false)
        }
        break
    }

    // ctrl + shift key events
    if (e.shiftKey && e.ctrlKey) {
      switch (e.key) {
        case 'R':
          e.preventDefault()
          setEditingTitle(true)
          break
      }
    }
  }

  // Trigger on node load or when editingTitle changes
  useEffect(() => {
    // keyboard shortcuts
    document.addEventListener('keydown', nodeKeyHandlers)
  }, [editingTitle])

  // const folder: boolean = currentNode.type === 'folder'
  const root: boolean = currentNode.nodeId === 'root'
  const restaurant = currentNode.type === 'restaurant'

  const customButtonStyle = { height: 30, marginLeft: 10, width: 30 }
  const reviewButtonStyle = {
    height: 40,
    width: 150,
    backgroundColor: '#EA3B2E',
    color: '#f5f5f5',
    fontWeight: 'bold',
  }
  return (
    <>
      {root ? (
        <div className="nodeHeader">
          <div
            className="nodeHeader-title"
            onDoubleClick={(e) => setEditingTitle(true)}
            onContextMenu={handleTitleRightClick}
          >
            <EditableText
              text={title}
              editing={editingTitle}
              setEditing={setEditingTitle}
              onEdit={handleUpdateTitle}
            />
          </div>
          <div className="nodeHeader-buttonBar">
            <Button
              isWhite={isLinking}
              style={customButtonStyle}
              icon={<ai.AiOutlinePlus />}
              onClick={onCreateNodeButtonClick}
            />
          </div>
        </div>
      ) : (
        restaurant && (
          <div className="heroContainer">
            <img
              src={currentNode.content.imageContent}
              className="hero"
              alt="Restaurant Image"
            />
            <div className="heroContent">
              <div>
                <h1 className="heroTitle">{currentNode.title}</h1>
                <div className="heroRating">{currentNode.content.rating} / 5</div>
              </div>
              <Button
                text="Write a Review"
                style={reviewButtonStyle}
                onClick={() => onReviewButtonClick()}
              />
            </div>
          </div>
        )
      )}
    </>
  )
}
