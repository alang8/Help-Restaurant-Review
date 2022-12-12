import React from 'react'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { currentNodeState, refreshState, selectedNodeState } from '../../../global/Atoms'
import { FrontendNodeGateway } from '../../../nodes'
import './OpenMapview.scss'
import Map, { Marker } from 'react-map-gl'
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'react-flow-renderer'
import { FrontendAnchorGateway } from '../../../anchors'
import { FrontendLinkGateway } from '../../../links/FrontendLinkGateway'
import { DataObjectOutlined } from '@mui/icons-material'

export interface IOpenMapviewModalProps {
  isOpen: boolean
  onSubmit: () => void
  onClose: () => void
}

export interface IMarker {
  longitude: number
  latitude: number
}

/**
 * Modal for moving a node to a new location
 */
export const OpenMapviewModal = (props: IOpenMapviewModalProps) => {
  const { isOpen, onClose } = props
  // state variables
  const currentNode = useRecoilValue(currentNodeState)
  const selectedNode = useRecoilValue(selectedNodeState)
  const refresh = useRecoilValue(refreshState)

  // Reset our state variables and close the modal
  const handleClose = () => {
    onClose()
  }

  // restaurant coordinates for map
  const [viewState, setViewState] = useState({
    latitude: 41.82698,
    longitude: -71.39962,
    zoom: 14,
  })
  const [markers, setMarkers] = useState<IMarker[]>([])

  useEffect(() => {
    const getAllNodes = async () => {
      const nodeResp = await FrontendNodeGateway.getAllNodes()
      if (!nodeResp.success) {
        console.log('Error getting nodes: ' + nodeResp.message)
      }
      const nodes = nodeResp.payload!
      const restaurants = nodes.filter((node) => node.type === 'restaurant')
      const newMarkers = [...markers]
      restaurants.forEach(async (restaurant) => {
        const location = restaurant.content.location
        const resp = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?country
        =us&autocomplete=false&limit=1&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
        )
        const data = await resp.json()
        if (data.features.length > 0) {
          const coordinates = data.features[0].geometry.coordinates
          newMarkers.push({
            longitude: coordinates[0],
            latitude: coordinates[1],
          })
        }
      })
      setMarkers(newMarkers)
    }
    getAllNodes()
  }, [currentNode, selectedNode, refresh])

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="modal-font">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>See Restaurants Near Me</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Map
              {...viewState}
              onMove={(evt) => setViewState(evt.viewState)}
              style={{ width: '100%', height: '40vh' }}
              mapStyle="mapbox://styles/mapbox/streets-v9"
              mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            >
              {markers.map((marker, idx) => (
                <Marker
                  longitude={marker.longitude}
                  latitude={marker.latitude}
                  anchor="bottom"
                  style={{ width: 20, height: 20 }}
                  key={idx}
                >
                  <img src="http://shorturl.at/cgjnM" />
                </Marker>
              ))}
            </Map>
          </ModalBody>
        </ModalContent>
      </div>
    </Modal>
  )
}
