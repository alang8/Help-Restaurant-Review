import React from 'react'
import './FolderPreviewContent.scss'

interface IFolderPreviewProps {
  content: any
}

/** The content of an image node, including any anchors */
export const FolderPreviewContent = (props: IFolderPreviewProps) => {
  const { content } = props
  console.log(content)
  /**
   * Return the preview container if we are rendering a folder preview
   */
  return (
    <div className="folderContent-preview">
      <img
        src="https://www.macworld.com/wp-content/uploads/2021/11/folder-icon-macos-1.png"
        alt="Folder preview"
      />
    </div>
  )
}
