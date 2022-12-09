import { Link } from '@tiptap/extension-link'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState } from 'react'
import { BiSave } from 'react-icons/bi'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { FrontendAnchorGateway } from '../../../../anchors'
import {
  currentNodeState,
  refreshAnchorState,
  refreshLinkListState,
  selectedExtentState,
} from '../../../../global/Atoms'
import { FrontendLinkGateway } from '../../../../links'
import { FrontendNodeGateway } from '../../../../nodes'
import {
  Extent,
  failureServiceResponse,
  IAnchor,
  INodeProperty,
  IServiceResponse,
  makeINodeProperty,
  makeITextExtent,
  successfulServiceResponse,
} from '../../../../types'
import { Button } from '../../../Button'
import './TextContent.scss'
import { TextMenu } from './TextMenu'
interface ITextContentProps {}

/** The content of an text node, including all its anchors */
export const TextContent = (props: ITextContentProps) => {
  const currentNode = useRecoilValue(currentNodeState)
  const [anchorRefresh, setAnchorRefresh] = useRecoilState(refreshAnchorState)
  const [linkMenuRefresh, setLinkMenuRefresh] = useRecoilState(refreshLinkListState)
  const setSelectedExtent = useSetRecoilState(selectedExtentState)
  const [refreshLinkList, setRefreshLinkList] = useRecoilState(refreshLinkListState)

  // State variable for current node text content
  const [textContent, setTextContent] = useState(currentNode.content)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: true, autolink: false, linkOnPaste: false }),
    ],
    content: currentNode.content,
    onUpdate: ({ editor }) => {
      setTextContent(editor.getHTML())
    },
  })

  // This function adds anchor marks for anchors in the database to the text editor
  const addAnchorMarks = async (): Promise<IServiceResponse<any>> => {
    if (!editor) {
      return failureServiceResponse('no editor')
    }
    const anchorResponse = await FrontendAnchorGateway.getAnchorsByNodeId(
      currentNode.nodeId
    )
    if (!anchorResponse || !anchorResponse.success) {
      return failureServiceResponse('failed to get anchors')
    }
    if (!anchorResponse.payload) {
      return successfulServiceResponse('no anchors to add')
    }
    for (let i = 0; i < anchorResponse.payload?.length; i++) {
      const anchor = anchorResponse.payload[i]
      const linkResponse = await FrontendLinkGateway.getLinksByAnchorId(anchor.anchorId)
      if (!linkResponse.success || !linkResponse.payload) {
        return failureServiceResponse('failed to get link')
      }
      const link = linkResponse.payload[0]
      let node = link.anchor1NodeId
      if (node == currentNode.nodeId) {
        node = link.anchor2NodeId
      }
      if (anchor.extent && anchor.extent.type == 'text') {
        editor.commands.setTextSelection({
          from: anchor.extent.startCharacter + 1,
          to: anchor.extent.endCharacter + 1,
        })
        editor.commands.setLink({
          href: `https://calm-mesa-01359.web.app/${node}/`,
          target: anchor.anchorId,
        })
      }
    }
    return successfulServiceResponse('added anchors')
  }

  // Set the content and add anchor marks when this component loads
  useEffect(() => {
    if (editor) {
      editor.commands.setContent(currentNode.content)
      setTextContent(currentNode.content)
      editor.commands.selectAll()
      // Unset all the links in the editor
      editor.commands.unsetLink()
      addAnchorMarks()
    }
  }, [currentNode, editor])

  // Set the selected extent to null when this component loads
  useEffect(() => {
    setSelectedExtent(null)
  }, [currentNode])

  // Handle setting the selected extent
  const onPointerUp = (e: React.PointerEvent) => {
    if (!editor) {
      return
    }
    const from = editor.state.selection.from
    const to = editor.state.selection.to
    const text = editor.state.doc.textBetween(from, to)
    if (from !== to) {
      const selectedExtent: Extent = {
        type: 'text',
        startCharacter: from - 1,
        endCharacter: to - 1,
        text: text,
      }
      setSelectedExtent(selectedExtent)
    } else {
      setSelectedExtent(null)
    }
  }

  if (!editor) {
    return <div>{currentNode.content}</div>
  }

  /**
   * Check if there are any anchors that need to be deleted. These anchors will be
   * any anchor in the database but not in the editor.
   */
  const checkDeleteAnchors = async (anchorsArray: string[]) => {
    // Get all the anchors in the database for this node
    const getAnchorsResp = await FrontendAnchorGateway.getAnchorsByNodeId(
      currentNode.nodeId
    )
    if (!getAnchorsResp.success) {
      console.log('Failed to get anchors by node ID:' + getAnchorsResp.message)
      return
    }
    const allDatabaseAnchorsForNode = getAnchorsResp.payload!
    // Get all the anchors that do not link from the node itself. That is, these
    // anchors have an extent
    const anchorsWithExtent: IAnchor[] = allDatabaseAnchorsForNode.filter((anchor) => {
      return anchor.extent != null
    })
    // Find the anchors that need to be deleted
    const anchorsToDelete: IAnchor[] = anchorsWithExtent.filter((anchor) => {
      return !anchorsArray.includes(anchor.anchorId)
    })
    // Get the anchor IDs that need to be deleted
    const anchorsToDeleteId: string[] = anchorsToDelete.map((anchor) => {
      return anchor.anchorId
    })

    // Delete the links associated with the to be deleted anchors
    const getLinksResp = await FrontendLinkGateway.getLinksByAnchorIds(anchorsToDeleteId)
    if (!getLinksResp.success) {
      console.log('Failed to get links by anchor IDs:' + getLinksResp.message)
      return
    }
    const linksToDelete = getLinksResp.payload!

    // Iterate through the links and delete both the anchors and the link itself
    linksToDelete.forEach(async (link) => {
      // Delete both anchors associated to a link
      const deleteAnchorsResp = await FrontendAnchorGateway.deleteAnchors([
        link.anchor1Id,
        link.anchor2Id,
      ])
      if (!deleteAnchorsResp.success) {
        console.log('Failed to delete anchors:' + deleteAnchorsResp.message)
        return
      }

      // Delete link itself
      const deleteLinkResp = await FrontendLinkGateway.deleteLink(link.linkId)
      if (!deleteLinkResp.success) {
        console.log('Failed to delete link:' + deleteLinkResp.message)
      }
    })

    // Set the content to whatever the current node is
    editor.commands.setContent(textContent)
    editor.commands.selectAll()
    // Unset all the links in the editor
    editor.commands.unsetLink()
    // Color only the links that are still present in editor
    await addAnchorMarks()
  }

  /**
   * Method to update the anchors in the database if the editor has changed.
   */
  const updateAnchors = async () => {
    const anchorsArray: string[] = []
    let promiseArray: Promise<any>[] = []
    // Iterate through all the marks in the editor
    editor.state.doc.descendants((node, pos, parent, index) => {
      promiseArray = node.marks.map(async (nodeMark) => {
        if (nodeMark.type.name === 'link') {
          // Find the anchor ID that is associated with this mark
          const anchorID: string = nodeMark.attrs.target
          anchorsArray.push(anchorID)
          const anchorResp = await FrontendAnchorGateway.getAnchor(anchorID)
          if (!anchorResp.success) {
            console.log('error')
          }
          // Create the new extent for the anchor
          const newExtent = makeITextExtent(
            node.text!,
            pos - 1,
            pos - 1 + node.text!.length
          )
          // Backend call to update the anchor and extent in the database
          const updateExtentResp = await FrontendAnchorGateway.updateExtent(
            anchorID,
            newExtent
          )
          if (!updateExtentResp.success) {
            console.log('Failed to update extent: ' + updateExtentResp.message)
          }
        }
      })
    })
    // Wait for all the promises to resolve
    await Promise.all(promiseArray)
    await checkDeleteAnchors(anchorsArray)
  }

  /* Method to update the text content for an editor. This method is called
  whenever the user hits the save button. */
  const handleUpdateTextContent = async () => {
    const nodeProperty: INodeProperty = makeINodeProperty('content', textContent)
    const textContentUpdateResp = await FrontendNodeGateway.updateNode(
      currentNode.nodeId,
      [nodeProperty]
    )
    if (!textContentUpdateResp.success) {
      console.log('Failed to update text content: ' + textContentUpdateResp.message)
      return
    }
    setAnchorRefresh(!anchorRefresh)
    setLinkMenuRefresh(!linkMenuRefresh)
    setRefreshLinkList(!refreshLinkList)
    await updateAnchors()
    setAnchorRefresh(!anchorRefresh)
    setLinkMenuRefresh(!linkMenuRefresh)
  }

  return (
    <div>
      <TextMenu editor={editor} />
      <Button
        text="Save"
        icon={<BiSave />}
        onClick={() => handleUpdateTextContent()}
        style={{
          background: '#ADD8E6',
          marginTop: '20px',
          height: '40px',
          marginLeft: '20px',
        }}
      />
      <EditorContent
        editor={editor}
        onPointerUp={onPointerUp}
        style={{ marginLeft: '20px' }}
      />
    </div>
  )
}
