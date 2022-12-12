import React from 'react'
import { Link } from 'react-router-dom'
import { INode } from '../../types'
// eslint-disable-next-line
import { TextPreviewContent } from '../NodeView/NodeContent/FolderContent/NodePreview/NodePreviewContent'
import './Search.scss'

export interface ISearchProps {
  node: INode
}

export const Search = ({ node }: ISearchProps) => {
  return (
    <Link to={`${node.nodeId}/`}>
      <div className="search-card">
        <div className="search-image">
          {node.type === 'folder' ? (
            <img src="https://cdn-icons-png.flaticon.com/512/3767/3767084.png" />
          ) : node.type === 'image' ? (
            <img src={node.content} />
          ) : (
            <TextPreviewContent content={node.content} />
            // <img src="https://cdn-icons-png.flaticon.com/512/3721/3721901.png" />
          )}
        </div>
        <div className="search-text-container">
          <div className="search-card-text">
            <b>Title:</b> {node.title}
          </div>
          <div className="search-card-text">
            <b>Type:</b> {node.type}
          </div>
          <div className="search-card-text">
            <b>Date created:</b> {node.dateCreated}
          </div>
          <div className="search-card-text">
            {node.type === 'folder' ? (
              <>
                <b>Content: </b>
                Folder!
              </>
            ) : node.type === 'image' ? (
              <>
                <b>Content: </b>
                Image!
              </>
            ) : (
              <>
                <b>Content:</b> {node.content}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
