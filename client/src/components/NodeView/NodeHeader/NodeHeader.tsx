import { Select } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import * as bi from 'react-icons/bi'
import * as ri from 'react-icons/ri'
import * as si from 'react-icons/si'
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
  isSearchingState,
} from '../../../global/Atoms'
import { FrontendNodeGateway } from '../../../nodes'
import { FrontendReviewGateway } from '../../../reviews/FrontendReviewGateway'
import { IFolderNode, INode, INodeProperty, makeINodeProperty } from '../../../types'
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
  const {
    onDeleteButtonClick,
    onMoveButtonClick,
    onHandleStartLinkClick,
    onHandleCompleteLinkClick,
    onOpenGraphClick,
    onReviewButtonClick,
  } = props
  const currentNode = useRecoilValue(currentNodeState)
  const selectedNode = useRecoilValue(selectedNodeState)
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
  // Recoil variable for whether search results are being displayed
  const isSearching = useRecoilValue(isSearchingState)
  // State variable for restaurant rating
  const [rating, setRating] = useState<number>(-1)

  /* Method to update the current folder view */
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

  // useEffect which updates the restaurant rating when there is a new review
  useEffect(() => {
    const getReviews = async () => {
      const reviewResp = await FrontendReviewGateway.getReviewsByNodeId(
        currentNode.nodeId
      )
      if (!reviewResp.success) {
        console.log('Error getting reviews: ' + reviewResp.message)
      }
      let reviews = reviewResp.payload!
      reviews = reviews.filter((review) => review.parentReviewId === null)
      if (reviews.length === 0) {
        setRating(-1)
      }
      let restaurantRating = reviews.reduce(
        (accumulator, review) => accumulator + review.rating,
        0
      )
      restaurantRating /= reviews.length
      restaurantRating = Math.round(restaurantRating * 100) / 100
      setRating(restaurantRating)
    }
    if (currentNode.type === 'restaurant') {
      getReviews()
    }
  }, [currentNode, refresh])

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
  const folder: boolean = currentNode.type === 'folder'
  const restaurant = currentNode.type === 'restaurant'

  const customButtonStyle = {
    // width: 'fit-content',
    width: '85px',
    backgroundColor: 'grey',
    marginRight: '10px',
  }
  const bigButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '140px',
    backgroundColor: 'grey',
    marginRight: '10px',
  }
  const startLinkButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '130px',
    backgroundColor: 'grey',
    marginRight: '10px',
  }
  const completeLinkButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '170px',
    backgroundColor: 'grey',
    marginRight: '10px',
  }
  const reviewButtonStyle = {
    width: '140px',
    backgroundColor: '#EA3B2E',
    color: '#f5f5f5',
    fontWeight: 'bold',
  }

  if (isSearching) {
    return <div className="nodeHeader">Search Results</div>
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
        </div>
      ) : restaurant ? (
        <div className="heroContainer">
          <img
            src={currentNode.content.imageContent}
            className="hero"
            alt="Restaurant Image"
          />
          <div className="heroContent">
            <div>
              <h1 className="heroTitle">{currentNode.title}</h1>
              {rating === -1 ? (
                <div className="heroRating">No rating yet!</div>
              ) : (
                <div className="heroRating">{rating} / 5</div>
              )}
            </div>
            <>
              {!isLinking && (
                <div className="restaurantButtons">
                  <Button
                    icon={<ri.RiDeleteBin6Line />}
                    style={customButtonStyle}
                    text="Delete"
                    onClick={() => onDeleteButtonClick(currentNode)}
                  />
                  <Button
                    icon={<ri.RiDragDropLine />}
                    style={customButtonStyle}
                    text="Move"
                    onClick={() => onMoveButtonClick(currentNode)}
                  />
                  <Button
                    icon={<ri.RiExternalLinkLine />}
                    style={startLinkButtonStyle}
                    text="Start Link"
                    onClick={onHandleStartLinkClick}
                  />
                  <Button
                    icon={<si.SiGraphql />}
                    style={bigButtonStyle}
                    text="Open Graph"
                    onClick={onOpenGraphClick}
                  />
                  <Button
                    text="Write a Review"
                    style={reviewButtonStyle}
                    onClick={() => onReviewButtonClick()}
                  />
                </div>
              )}
              {isLinking && (
                <Button
                  text="Complete Link"
                  style={completeLinkButtonStyle}
                  icon={<bi.BiLinkAlt />}
                  onClick={onHandleCompleteLinkClick}
                />
              )}
              {folder && (
                <div className="select">
                  <Select
                    bg="f1f1f1"
                    defaultValue={(currentNode as IFolderNode).viewType}
                    onChange={handleUpdateFolderView}
                    height={35}
                  >
                    <option value="grid">Grid</option>
                    <option value="list">List</option>
                  </Select>
                </div>
              )}
            </>
            {/* <Button
              text="Write a Review"
              style={reviewButtonStyle}
              onClick={() => onReviewButtonClick()}
            /> */}
          </div>
        </div>
      ) : (
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
            {!root && (
              <>
                {!isLinking && (
                  <>
                    <Button
                      icon={<ri.RiDeleteBin6Line />}
                      text="Delete"
                      onClick={() => onDeleteButtonClick(currentNode)}
                    />
                    <Button
                      icon={<ri.RiDragDropLine />}
                      text="Move"
                      onClick={() => onMoveButtonClick(currentNode)}
                    />
                    <Button
                      icon={<ri.RiExternalLinkLine />}
                      text="Start Link"
                      onClick={onHandleStartLinkClick}
                    />
                    <Button
                      icon={<si.SiGraphql />}
                      text="Open Graph"
                      onClick={onOpenGraphClick}
                    />
                  </>
                )}
                {isLinking && (
                  <Button
                    text="Complete Link"
                    icon={<bi.BiLinkAlt />}
                    onClick={onHandleCompleteLinkClick}
                  />
                )}
                {folder && (
                  <div className="select">
                    <Select
                      bg="f1f1f1"
                      defaultValue={(currentNode as IFolderNode).viewType}
                      onChange={handleUpdateFolderView}
                      height={35}
                    >
                      <option value="grid">Grid</option>
                      <option value="list">List</option>
                    </Select>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
