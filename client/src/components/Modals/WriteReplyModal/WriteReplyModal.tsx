import {
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  refreshLinkListState,
  refreshState,
  selectedNodeState,
  selectedParentReviewState,
} from '../../../global/Atoms'
import { Button } from '../../Button'
import { generateObjectId } from '../../../global'
import { IReview } from '../../../types'
import './WriteReplyModal.scss'
import { FrontendReviewGateway } from '../../../reviews'

export interface IWriteReplyModal {
  isOpen: boolean
  onClose: () => void
}

/**
 * Modal for moving a reply to restaurant review
 */
export const WriteReplyModal = (props: IWriteReplyModal) => {
  const { isOpen, onClose } = props

  // state variables
  const selectedNode = useRecoilValue(selectedNodeState)
  const [error, setError] = useState<string>('')
  const [refresh, setRefresh] = useRecoilState(refreshState)
  const [refreshLinkList, setRefreshLinkList] = useRecoilState(refreshLinkListState)
  const parentReview = useRecoilValue(selectedParentReviewState)

  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')

  // event handlers for the modal inputs and dropdown selects
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value)
  }

  // Called when the "Submit" button is clicked
  const handleSubmit = async () => {
    let review: IReview | null = null

    // form validation
    if (name.length === 0) {
      setError('Error: Name cannot be empty')
      return
    }
    if (content.length === 0) {
      setError('Error: Reply cannot be empty')
      return
    }

    const reviewId = generateObjectId('review')
    const date = new Date()
    const newReview: IReview = {
      reviewId: reviewId,
      author: name,
      nodeId: selectedNode!.nodeId,
      parentReviewId: parentReview,
      content: content,
      rating: rating,
      replies: [],
      dateCreated: date,
      dateModified: date,
    }
    console.log('newReview', newReview)
    const reviewResponse = await FrontendReviewGateway.createReview(newReview)
    if (!reviewResponse.success) {
      setError('Error: Failed to create review')
      return
    }
    review = reviewResponse.payload
    if (review !== null) {
      handleClose()
      setRefresh(!refresh)
      setRefreshLinkList(!refreshLinkList)
    }
  }

  // Reset our state variables and close the modal
  const handleClose = () => {
    onClose()
    setError('')
    setName('')
    setRating(0)
    setContent('')
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="modal-font">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Write Reply</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <span className="modal-title">
              <div className="modal-title-header">Name</div>
            </span>
            <Input value={name} onChange={handleNameChange} placeholder="Name..." />
            <div className="modal-input">
              Reply
              <Textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Reply..."
              />
            </div>
          </ModalBody>
          <ModalFooter>
            {error.length > 0 && <div className="modal-error">{error}</div>}
            <div className="modal-footer-buttons">
              <Button text="Submit" onClick={handleSubmit} />
            </div>
          </ModalFooter>
        </ModalContent>
      </div>
    </Modal>
  )
}
