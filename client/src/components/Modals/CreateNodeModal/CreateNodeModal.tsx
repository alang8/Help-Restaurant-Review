import {
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import {
  INode,
  NodeIdsToNodesMap,
  NodeType,
  nodeTypes,
  RecursiveNodeTree,
} from '../../../types'
import { Button } from '../../Button'
import { TreeView } from '../../TreeView'
import './CreateNodeModal.scss'
import { createNodeFromModal, uploadImage } from './createNodeUtils'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { refreshState, selectedNodeState } from '../../../global/Atoms'

export interface ICreateNodeModalProps {
  isOpen: boolean
  nodeIdsToNodesMap: NodeIdsToNodesMap
  onClose: () => void
  onSubmit: () => unknown
  roots: RecursiveNodeTree[]
}

/**
 * Modal for adding a new node; lets the user choose a title, type,
 * and parent node
 */
export const CreateNodeModal = (props: ICreateNodeModalProps) => {
  // deconstruct props variables
  const { isOpen, onClose, roots, nodeIdsToNodesMap, onSubmit } = props

  // state variables
  const setSelectedNode = useSetRecoilState(selectedNodeState)
  const [selectedParentNode, setSelectedParentNode] = useState<INode | null>(null)
  const [title, setTitle] = useState('')
  const [modalContent, setModalContent] = useState('')
  const [selectedType, setSelectedType] = useState<NodeType>('' as NodeType)
  const [error, setError] = useState<string>('')
  const [refresh, setRefresh] = useRecoilState(refreshState)

  // state variables (restaurant)
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [monStartHours, setMonStartHours] = React.useState('00:00')
  const [monEndHours, setMonEndHours] = React.useState('00:00')
  const [tueStartHours, setTueStartHours] = React.useState('00:00')
  const [tueEndHours, setTueEndHours] = React.useState('00:00')
  const [wedStartHours, setWedStartHours] = React.useState('00:00')
  const [wedEndHours, setWedEndHours] = React.useState('00:00')
  const [thuStartHours, setThuStartHours] = React.useState('00:00')
  const [thuEndHours, setThuEndHours] = React.useState('00:00')
  const [friStartHours, setFriStartHours] = React.useState('00:00')
  const [friEndHours, setFriEndHours] = React.useState('00:00')
  const [satStartHours, setSatStartHours] = React.useState('00:00')
  const [satEndHours, setSatEndHours] = React.useState('00:00')
  const [sunStartHours, setSunStartHours] = React.useState('00:00')
  const [sunEndHours, setSunEndHours] = React.useState('00:00')

  // event handlers for the modal inputs and dropdown selects
  const handleSelectedTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value.toLowerCase() as NodeType)
    setModalContent('')
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleTextContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setModalContent(event.target.value)
  }

  const handleImageContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModalContent(event.target.value)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    const link = files && files[0] && (await uploadImage(files[0]))
    link && setModalContent(link)
  }

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value)
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value)
  }

  const handleWebsiteUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWebsiteUrl(event.target.value)
  }

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value)
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  // called when the "Create" button is clicked
  const handleSubmit = async () => {
    // form validation
    if (!nodeTypes.includes(selectedType)) {
      setError('Error: No type selected')
      return
    }
    if (title.length === 0) {
      setError('Error: No title')
      return
    }
    // Form validation
    if (selectedType === 'restaurant') {
      if (description.length === 0) {
        setError('Error: No description')
        return
      }
      if (location.length === 0) {
        setError('Error: No location')
        return
      }
      if (websiteUrl.length === 0) {
        setError('Error: No website URL')
        return
      }
      if (phoneNumber.length === 0) {
        setError('Error: No phone number')
        return
      }
      if (email.length === 0) {
        setError('Error: No email')
        return
      }
      if (monStartHours >= monEndHours) {
        setError('Error: Invalid Monday hours')
        return
      }
      if (tueStartHours >= tueEndHours) {
        setError('Error: Invalid Tuesday hours')
        return
      }
      if (wedStartHours >= wedEndHours) {
        setError('Error: Invalid Wednesday hours')
        return
      }
      if (thuStartHours >= thuEndHours) {
        setError('Error: Invalid Thursday hours')
        return
      }
      if (friStartHours >= friEndHours) {
        setError('Error: Invalid Friday hours')
        return
      }
      if (satStartHours >= satEndHours) {
        setError('Error: Invalid Saturday hours')
        return
      }
      if (sunStartHours >= sunEndHours) {
        setError('Error: Invalid Sunday hours')
        return
      }
    }

    // content for the modal based on type
    const content =
      selectedType === 'restaurant'
        ? {
            location: location,
            description: description,
            phoneNumber: phoneNumber,
            email: email,
            hours: {
              mon: {
                start: monStartHours,
                end: monEndHours,
              },
              tue: {
                start: tueStartHours,
                end: tueEndHours,
              },
              wed: {
                start: wedStartHours,
                end: wedEndHours,
              },
              thu: {
                start: thuStartHours,
                end: thuEndHours,
              },
              fri: {
                start: friStartHours,
                end: friEndHours,
              },
              sat: {
                start: satStartHours,
                end: satEndHours,
              },
              sun: {
                start: sunStartHours,
                end: sunEndHours,
              },
            },
            rating: null,
            reviews: [],
            websiteUrl: websiteUrl,
            imageContent: modalContent == '' ? 'https://shorturl.at/ijm46' : modalContent,
          }
        : modalContent
    const attributes = {
      content,
      nodeIdsToNodesMap,
      parentNodeId: selectedParentNode ? selectedParentNode.nodeId : null,
      title,
      type: selectedType as NodeType,
    }
    const node = await createNodeFromModal(attributes)
    node && setSelectedNode(node)
    setRefresh(!refresh)
    onSubmit()
    handleClose()
  }

  /** Reset all our state variables and close the modal */
  const handleClose = () => {
    onClose()
    setTitle('')
    setSelectedParentNode(null)
    setSelectedType('' as NodeType)
    setModalContent('')
    setError('')
    setLocation('')
    setDescription('')
    setWebsiteUrl('')
    setPhoneNumber('')
    setEmail('')
    setModalContent('')
    setMonStartHours('00:00')
    setMonEndHours('00:00')
    setTueStartHours('00:00')
    setTueEndHours('00:00')
    setWedStartHours('00:00')
    setWedEndHours('00:00')
    setThuStartHours('00:00')
    setThuEndHours('00:00')
    setFriStartHours('00:00')
    setFriEndHours('00:00')
    setSatStartHours('00:00')
    setSatEndHours('00:00')
    setSunStartHours('00:00')
    setSunEndHours('00:00')
  }

  // content prompts for the different node types
  let contentInputPlaceholder: string
  switch (selectedType) {
    case 'text':
      contentInputPlaceholder = 'Text content...'
      break
    case 'image':
      contentInputPlaceholder = 'Image URL...'
      break
    case 'restaurant':
      contentInputPlaceholder = 'Description...'
      break
    default:
      contentInputPlaceholder = 'Content...'
  }

  const isImage: boolean = selectedType === 'image'
  const isText: boolean = selectedType === 'text'
  const isRestaurant: boolean = selectedType === 'restaurant'

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="modal-font">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new node</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input value={title} onChange={handleTitleChange} placeholder="Title..." />
            <div className="modal-input">
              <Select
                value={selectedType}
                onChange={handleSelectedTypeChange}
                placeholder="Select a type"
              >
                {nodeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </Select>
            </div>
            {selectedType && isText && (
              <div className="modal-input">
                <Textarea
                  value={modalContent}
                  onChange={handleTextContentChange}
                  placeholder={contentInputPlaceholder}
                />
              </div>
            )}
            {selectedType && isImage && (
              <div className="modal-input">
                <Input
                  value={modalContent}
                  onChange={handleImageContentChange}
                  placeholder={contentInputPlaceholder}
                />
              </div>
            )}
            {selectedType && isImage && (
              <div className="modal-input">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  placeholder={contentInputPlaceholder}
                />
              </div>
            )}

            {selectedType && isRestaurant && (
              <div className="modal-input">
                <Input
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder={contentInputPlaceholder}
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                <Input
                  value={location}
                  onChange={handleLocationChange}
                  placeholder="Location..."
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                <Input
                  value={websiteUrl}
                  onChange={handleWebsiteUrlChange}
                  placeholder="Website URL..."
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                <Input
                  value={modalContent}
                  onChange={handleImageContentChange}
                  placeholder="Image URL..."
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  placeholder="Upload Image..."
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                <InputGroup>
                  <InputLeftAddon>+1</InputLeftAddon>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="Phone Number..."
                  />
                </InputGroup>
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                <Input
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Email..."
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Monday Hours (ET)
                <Input
                  type="time"
                  onChange={(event) => setMonStartHours(event.target.value)}
                  value={monStartHours}
                />
                <Input
                  type="time"
                  onChange={(event) => setMonEndHours(event.target.value)}
                  value={monEndHours}
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Tuesday Hours (ET)
                <Input
                  type="time"
                  onChange={(event) => setTueStartHours(event.target.value)}
                  value={tueStartHours}
                />
                <Input
                  type="time"
                  onChange={(event) => setTueEndHours(event.target.value)}
                  value={tueEndHours}
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Wednesday Hours (ET)
                <Input
                  type="time"
                  onChange={(event) => setWedStartHours(event.target.value)}
                  value={wedStartHours}
                />
                <Input
                  type="time"
                  onChange={(event) => setWedEndHours(event.target.value)}
                  value={wedEndHours}
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Thursday Hours (ET)
                <Input
                  type="time"
                  onChange={(event) => setThuStartHours(event.target.value)}
                  value={thuStartHours}
                />
                <Input
                  type="time"
                  onChange={(event) => setThuEndHours(event.target.value)}
                  value={thuEndHours}
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Friday Hours (ET)
                <Input
                  type="time"
                  onChange={(event) => setFriStartHours(event.target.value)}
                  value={friStartHours}
                />
                <Input
                  type="time"
                  onChange={(event) => setFriEndHours(event.target.value)}
                  value={friEndHours}
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Saturday Hours (ET)
                <Input
                  type="time"
                  onChange={(event) => setSatStartHours(event.target.value)}
                  value={satStartHours}
                />
                <Input
                  type="time"
                  onChange={(event) => setSatEndHours(event.target.value)}
                  value={satEndHours}
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Sunday Hours (ET)
                <Input
                  type="time"
                  onChange={(event) => setSunStartHours(event.target.value)}
                  value={sunStartHours}
                />
                <Input
                  type="time"
                  onChange={(event) => setSunEndHours(event.target.value)}
                  value={sunEndHours}
                />
              </div>
            )}

            <div className="modal-section">
              <span className="modal-title">
                <div className="modal-title-header">Choose a parent node (optional):</div>
              </span>
              <div className="modal-treeView">
                <TreeView
                  roots={roots}
                  parentNode={selectedParentNode}
                  setParentNode={setSelectedParentNode}
                  changeUrlOnClick={false}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {error.length > 0 && <div className="modal-error">{error}</div>}
            <div className="modal-footer-buttons">
              <Button text="Create" onClick={handleSubmit} />
            </div>
          </ModalFooter>
        </ModalContent>
      </div>
    </Modal>
  )
}
