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
import { useRecoilState } from 'recoil'
import { refreshState, selectedNodeState } from '../../../global/Atoms'
import { FrontendNodeGateway } from '../../../nodes'
import './OpenGraphModal.scss'
// import BasicFlow from './Flow'
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'react-flow-renderer'
import { FrontendAnchorGateway } from '../../../anchors'
import { FrontendLinkGateway } from '../../../links/FrontendLinkGateway'

export interface IOpenGraphModalProps {
  isOpen: boolean
  // node: INode
  onSubmit: () => void
  onClose: () => void
  // roots: RecursiveNodeTree[]
}

/**
 * Modal for moving a node to a new location
 */
export const OpenGraphModal = (props: IOpenGraphModalProps) => {
  // const { isOpen, onClose, onSubmit, node, roots } = props
  const { isOpen, onClose, onSubmit } = props
  // state variables
  const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeState)
  const [error, setError] = useState<string>('')
  const [refresh, setRefresh] = useRecoilState(refreshState)

  // Reset our state variables and close the modal
  const handleClose = () => {
    onClose()
    setError('')
  }

  interface ReactFlowNode {
    id: string
    data: { label: string }
    position: { x: number; y: number }
  }

  interface ReactFlowEdge {
    id: string
    source: string
    target: string
  }

  const [nodes, setNodes] = useState<ReactFlowNode[]>([])
  const [edges, setEdges] = useState<ReactFlowEdge[]>([])

  const onNodesChange = useCallback(
    (changes) => setNodes((ns) => applyNodeChanges(changes, ns)),
    []
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges((es) => applyEdgeChanges(changes, es)),
    []
  )
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  )

  useEffect(() => {
    async function getNodes() {
      // Initialize the nodes with the selected node as the root
      const nodes: ReactFlowNode[] = [
        {
          id: selectedNode!.nodeId,
          data: { label: selectedNode!.title },
          position: { x: 0, y: 0 },
        },
      ]

      // Get the anchors for the selected node
      const getAnchorsResp = await FrontendAnchorGateway.getAnchorsByNodeId(
        selectedNode!.nodeId
      )
      if (!getAnchorsResp.success) {
        console.log('error:' + getAnchorsResp.message)
        return
      }
      const anchors = getAnchorsResp.payload

      // Map the anchors to anchor IDs
      const anchorsIds = anchors!.map((anchor) => anchor.anchorId)

      // Get the links from the anchor IDs
      const getLinksResp = await FrontendLinkGateway.getLinksByAnchorIds(anchorsIds)
      if (!getLinksResp.success) {
        console.log('error:' + getLinksResp.message)
        return
      }
      const links = getLinksResp.payload

      // Initialize an array to hold the node IDs of the nodes to be displayed
      const nodeIDs: string[] = []
      links!.forEach((link) => {
        const node1Id = link!.anchor1NodeId
        const node2Id = link!.anchor2NodeId
        if (node1Id != selectedNode!.nodeId) {
          nodeIDs.push(node1Id)
        }
        if (node2Id != selectedNode!.nodeId) {
          nodeIDs.push(node2Id)
        }
      })

      // Get the nodes from the node IDs
      const getNodesResp = await FrontendNodeGateway.getNodes(nodeIDs)
      if (!getNodesResp.success) {
        console.log('error:' + getNodesResp.message)
        return
      }
      const linkNodes = getNodesResp.payload

      // Map the nodes to ReactFlow nodes
      linkNodes!.forEach((node) => {
        let scale = 1
        if (nodes.length >= 4) {
          scale = Math.floor(nodes.length / 4) + 1
        }

        let xPos = 0
        let yPos = 0
        if (nodes.length % 8 == 0) {
          yPos = 100 * scale
        } else if (nodes.length % 8 == 1) {
          xPos = 200 * scale
        } else if (nodes.length % 8 == 2) {
          yPos = -100 * scale
        } else if (nodes.length % 8 == 3) {
          xPos = -200 * scale
        } else if (nodes.length % 8 == 4) {
          xPos = 100 * scale
          yPos = 50 * scale
        } else if (nodes.length % 8 == 5) {
          xPos = 100 * scale
          yPos = -50 * scale
        } else if (nodes.length % 8 == 6) {
          xPos = -100 * scale
          yPos = 50 * scale
        } else {
          xPos = -100 * scale
          yPos = -50 * scale
        }
        nodes.push({
          id: node.nodeId,
          data: { label: node.title },
          position: { x: xPos, y: yPos },
        })
      })

      // Initialize an array to hold the edges to be displayed
      const edges: ReactFlowEdge[] = []
      // Map the nodes to ReactFlow edges. Everything is connected to the root node
      nodes.map((node) => {
        edges.push({ id: 'e-' + node.id, source: selectedNode!.nodeId, target: node.id })
      })
      setNodes(nodes)
      setEdges(edges)
    }
    if (selectedNode !== null) {
      getNodes()
    }
  }, [selectedNode, refresh])

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="modal-font">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Visualizing Node Collection</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <span className="modal-title">
              <div className="modal-title-header">See Graph!</div>
            </span>
            <div className="react-flow-container">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
              />
            </div>

            {/* <div className="modal-treeView">
              <TreeView
                roots={roots}
                parentNode={selectedParentNode}
                setParentNode={setSelectedParentNode}
                changeUrlOnClick={false}
              />
            </div> */}
          </ModalBody>
          {/* <ModalFooter>
            {error.length > 0 && <div className="modal-error">{error}</div>}
            <div className="modal-footer-buttons">
              <Button
                text={selectedParentNode ? 'Move to selected node' : 'Move to root'}
                onClick={handleSubmit}
              />
            </div>
          </ModalFooter> */}
        </ModalContent>
      </div>
    </Modal>
  )
}
