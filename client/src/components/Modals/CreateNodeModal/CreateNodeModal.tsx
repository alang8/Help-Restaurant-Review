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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { selectedNodeState } from '../../../global/Atoms'
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
  const [selectedType, setSelectedType] = useState<NodeType>('' as NodeType)
  const [error, setError] = useState<string>('')

  // event handlers for the modal inputs and dropdown selects
  const handleSelectedTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value.toLowerCase() as NodeType)
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
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

  const handleImageContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageContent(event.target.value)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    const link = files && files[0] && (await uploadImage(files[0]))
    link && setImageContent(link)
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
    const content = {
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
    // setContent('')
    setError('')
  }

  const isImage: boolean = selectedType === 'image'
  const isRestaurant: boolean = selectedType === 'restaurant'

  const formatTime = (val: number) => val
  // const formatTime = (val: number) => val + 'ET'

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="modal-font">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new node</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={title}
              onChange={handleTitleChange}
              placeholder="Restaurant Name..."
            />
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
            {selectedType && isRestaurant && (
              <div className="modal-input">
                <Input
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Description..."
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
                <NumberInput
                  onChange={(valueString) => setMonStartHours(Number(valueString))}
                  value={formatTime(monStartHours)}
                  step={1}
                  defaultValue={monStartHours}
                  min={0}
                  max={24}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <NumberInput
                  onChange={(valueString) => setMonEndHours(Number(valueString))}
                  value={formatTime(monEndHours)}
                  step={1}
                  defaultValue={monEndHours}
                  min={0}
                  max={24}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Tuesday Hours (ET)
                <NumberInput
                  onChange={(valueString) => setTueStartHours(Number(valueString))}
                  value={formatTime(tueStartHours)}
                  step={1}
                  defaultValue={tueStartHours}
                  min={0}
                  max={24}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <NumberInput
                  onChange={(valueString) => setTueEndHours(Number(valueString))}
                  value={formatTime(tueEndHours)}
                  step={1}
                  defaultValue={tueEndHours}
                  min={0}
                  max={24}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Wednesday Hours (ET)
                <NumberInput
                  onChange={(valueString) => setWedStartHours(Number(valueString))}
                  value={formatTime(wedStartHours)}
                  step={1}
                  defaultValue={wedStartHours}
                  min={0}
                  max={24}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <NumberInput
                  onChange={(valueString) => setWedEndHours(Number(valueString))}
                  value={formatTime(wedEndHours)}
                  step={1}
                  defaultValue={wedEndHours}
                  min={0}
                  max={24}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Thursday Hours (ET)
                <NumberInput
                  onChange={(valueString) => setThuStartHours(Number(valueString))}
                  value={formatTime(thuStartHours)}
                  step={1}
                  defaultValue={thuStartHours}
                  min={0}
                  max={24}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <NumberInput
                  onChange={(valueString) => setThuEndHours(Number(valueString))}
                  value={formatTime(thuEndHours)}
                  step={1}
                  defaultValue={thuEndHours}
                  min={0}
                  max={24}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Friday Hours (ET)
                <NumberInput
                  onChange={(valueString) => setFriStartHours(Number(valueString))}
                  value={formatTime(friStartHours)}
                  step={1}
                  defaultValue={friStartHours}
                  min={0}
                  max={24}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <NumberInput
                  onChange={(valueString) => setFriEndHours(Number(valueString))}
                  value={formatTime(friEndHours)}
                  step={1}
                  defaultValue={friEndHours}
                  min={0}
                  max={24}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Saturday Hours (ET)
                <NumberInput
                  onChange={(valueString) => setSatStartHours(Number(valueString))}
                  value={formatTime(satStartHours)}
                  step={1}
                  defaultValue={satStartHours}
                  min={0}
                  max={24}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <NumberInput
                  onChange={(valueString) => setSatEndHours(Number(valueString))}
                  value={formatTime(satEndHours)}
                  step={1}
                  defaultValue={satEndHours}
                  min={0}
                  max={24}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
            )}
            {selectedType && isRestaurant && (
              <div className="modal-input">
                Sunday Hours (ET)
                <NumberInput
                  onChange={(valueString) => setSunStartHours(Number(valueString))}
                  value={formatTime(sunStartHours)}
                  step={1}
                  defaultValue={sunStartHours}
                  min={0}
                  max={24}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <NumberInput
                  onChange={(valueString) => setSunEndHours(Number(valueString))}
                  value={formatTime(sunEndHours)}
                  step={1}
                  defaultValue={sunEndHours}
                  min={0}
                  max={24}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
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
