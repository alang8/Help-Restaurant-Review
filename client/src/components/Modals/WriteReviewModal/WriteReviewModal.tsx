import {
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Textarea,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import {
  refreshLinkListState,
  refreshState,
  selectedNodeState,
} from '../../../global/Atoms'
import { Button } from '../../Button'
import { generateObjectId } from '../../../global'
import { IReview } from '../../../types'
import './WriteReviewModal.scss'
import { FrontendReviewGateway } from '../../../reviews'

export interface IWriteReviewModalProps {
  isOpen: boolean
  // node: INode
  onSubmit: () => void
  onClose: () => void
  // roots: RecursiveNodeTree[]
}

/**
 * Modal for moving a node to a new location
 */
export const WriteReviewModal = (props: IWriteReviewModalProps) => {
  // const { isOpen, onClose, onSubmit, node, roots } = props
  // eslint-disable-next-line
  const { isOpen, onClose, onSubmit } = props
  // state variables
  // eslint-disable-next-line
  const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeState)
  const [error, setError] = useState<string>('')
  const [refresh, setRefresh] = useRecoilState(refreshState)
  const [refreshLinkList, setRefreshLinkList] = useRecoilState(refreshLinkListState)

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

    const reviewId = generateObjectId('review')
    const date = new Date()
    const newReview: IReview = {
      reviewId: reviewId,
      author: name,
      nodeId: selectedNode!.nodeId,
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
          <ModalHeader>Write Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <span className="modal-title">
              <div className="modal-title-header">Name</div>
            </span>
            <Input value={name} onChange={handleNameChange} placeholder="Name..." />
            <div className="modal-input">
              Rating (Out of 5)
              <NumberInput
                onChange={(valueString) => setRating(Number(valueString))}
                value={rating}
                step={1}
                defaultValue={rating}
                min={0}
                max={5}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </div>
            <div className="modal-input">
              Leave a Review
              <Textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Review..."
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
