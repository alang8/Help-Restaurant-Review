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
import { useSetRecoilState } from 'recoil'
import { selectedNodeState } from '../../../global/Atoms'

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
  const [content, setContent] = useState('')
  const [selectedType, setSelectedType] = useState<NodeType>('' as NodeType)
  const [error, setError] = useState<string>('')

  // state variables (restaurant)
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [imageContent, setImageContent] = useState('')
  const [monStartHours, setMonStartHours] = React.useState(0)
  const [monEndHours, setMonEndHours] = React.useState(0)
  const [tueStartHours, setTueStartHours] = React.useState(0)
  const [tueEndHours, setTueEndHours] = React.useState(0)
  const [wedStartHours, setWedStartHours] = React.useState(0)
  const [wedEndHours, setWedEndHours] = React.useState(0)
  const [thuStartHours, setThuStartHours] = React.useState(0)
  const [thuEndHours, setThuEndHours] = React.useState(0)
  const [friStartHours, setFriStartHours] = React.useState(0)
  const [friEndHours, setFriEndHours] = React.useState(0)
  const [satStartHours, setSatStartHours] = React.useState(0)
  const [satEndHours, setSatEndHours] = React.useState(0)
  const [sunStartHours, setSunStartHours] = React.useState(0)
  const [sunEndHours, setSunEndHours] = React.useState(0)

  // event handlers for the modal inputs and dropdown selects
  const handleSelectedTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value.toLowerCase() as NodeType)
    setContent('')
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleTextContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value)
  }

  const handleImageContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value)
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
    if (!nodeTypes.includes(selectedType)) {
      setError('Error: No type selected')
      return
    }
    if (title.length === 0) {
      setError('Error: No title')
      return
    }
    const attributes = {
      content,
      nodeIdsToNodesMap,
      parentNodeId: selectedParentNode ? selectedParentNode.nodeId : null,
      title,
      type: selectedType as NodeType,
    }
    const node = await createNodeFromModal(attributes)
    node && setSelectedNode(node)
    onSubmit()
    handleClose()
  }

  /** Reset all our state variables and close the modal */
  const handleClose = () => {
    onClose()
    setTitle('')
    setSelectedParentNode(null)
    setSelectedType('' as NodeType)
    setContent('')
    setError('')
    setLocation('')
    setDescription('')
    setWebsiteUrl('')
    setPhoneNumber('')
    setEmail('')
    setImageContent('')
    setMonStartHours(0)
    setMonEndHours(0)
    setTueStartHours(0)
    setTueEndHours(0)
    setWedStartHours(0)
    setWedEndHours(0)
    setThuStartHours(0)
    setThuEndHours(0)
    setFriStartHours(0)
    setFriEndHours(0)
    setSatStartHours(0)
    setSatEndHours(0)
    setSunStartHours(0)
    setSunEndHours(0)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    const link = files && files[0] && (await uploadImage(files[0]))
    link && setContent(link)
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
  const formatTime = (val: number) => val

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
                  value={content}
                  onChange={handleTextContentChange}
                  placeholder={contentInputPlaceholder}
                />
              </div>
            )}
            {selectedType && isImage && (
              <div className="modal-input">
                <Input
                  value={content}
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
                  value={imageContent}
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
                  onChange={(valueString) => setMonStartHours(Number(valueString))}
                  value={formatTime(monStartHours)}
                />
                <Input
                  type="time"
                  onChange={(valueString) => setMonEndHours(Number(valueString))}
                  value={formatTime(monEndHours)}
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Tuesday Hours (ET)
                <Input
                  type="time"
                  onChange={(valueString) => setTueStartHours(Number(valueString))}
                  value={formatTime(tueStartHours)}
                />
                <Input
                  type="time"
                  onChange={(valueString) => setTueEndHours(Number(valueString))}
                  value={formatTime(tueEndHours)}
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Wednesday Hours (ET)
                <Input
                  type="time"
                  onChange={(valueString) => setWedStartHours(Number(valueString))}
                  value={formatTime(wedStartHours)}
                />
                <Input
                  type="time"
                  onChange={(valueString) => setWedEndHours(Number(valueString))}
                  value={formatTime(wedEndHours)}
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Thursday Hours (ET)
                <Input
                  type="time"
                  onChange={(valueString) => setThuStartHours(Number(valueString))}
                  value={formatTime(thuStartHours)}
                />
                <Input
                  type="time"
                  onChange={(valueString) => setThuEndHours(Number(valueString))}
                  value={formatTime(thuEndHours)}
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Friday Hours (ET)
                <Input
                  type="time"
                  onChange={(valueString) => setFriStartHours(Number(valueString))}
                  value={formatTime(friStartHours)}
                />
                <Input
                  type="time"
                  onChange={(valueString) => setFriEndHours(Number(valueString))}
                  value={formatTime(friEndHours)}
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Saturday Hours (ET)
                <Input
                  type="time"
                  onChange={(valueString) => setSatStartHours(Number(valueString))}
                  value={formatTime(satStartHours)}
                />
                <Input
                  type="time"
                  onChange={(valueString) => setSatEndHours(Number(valueString))}
                  value={formatTime(satEndHours)}
                />
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Sunday Hours (ET)
                <Input
                  type="time"
                  onChange={(valueString) => setSunStartHours(Number(valueString))}
                  value={formatTime(sunStartHours)}
                />
                <Input
                  type="time"
                  onChange={(valueString) => setSunEndHours(Number(valueString))}
                  value={formatTime(sunEndHours)}
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
