import React from 'react'
import { Button } from '../Button'
import * as ri from 'react-icons/ri'
import * as ai from 'react-icons/ai'

import { NodeIdsToNodesMap } from '../../types'
import { Link } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { isLinkingState, startAnchorState, selectedExtentState } from '../../global/Atoms'
import './Header.scss'

interface IHeaderProps {
  nodeIdsToNodesMap: NodeIdsToNodesMap
  onCreateNodeButtonClick: () => void
  onSearchButtonClick: (query: string) => void
  onHomeClick: () => void
}

export const Header = (props: IHeaderProps) => {
  const { onHomeClick, onCreateNodeButtonClick, onSearchButtonClick, nodeIdsToNodesMap } =
    props
  const customButtonStyle = { height: 30, marginLeft: 10, width: 30 }
  const searchButtonStyle = { height: 30, width: 80 }
  const loginButtonStyle = {
    height: 30,
    marginLeft: 10,
    width: 100,
    backgroundColor: '#EA3B2E',
    color: '#f5f5f5',
    fontWeight: 'bold',
  }
  const signupButtonStyle = {
    height: 30,
    marginLeft: 10,
    width: 100,
    backgroundColor: '#EA3B2E',
    color: '#f5f5f5',
    fontWeight: 'bold',
  }
  const [isLinking, setIsLinking] = useRecoilState(isLinkingState)
  const [startAnchor, setStartAnchor] = useRecoilState(startAnchorState)
  const setSelectedExtent = useSetRecoilState(selectedExtentState)
  const [searchTerm, setSearchTerm] = React.useState('')

  const handleCancelLink = () => {
    setStartAnchor(null)
    setSelectedExtent(null)
    setIsLinking(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value
    setSearchTerm(searchValue)
  }

  return (
    <div className={isLinking ? 'header-linking' : 'header'}>
      <div className="left-bar">
        <Link to={'/'}>
          <img
            className="logo"
            src="../../HelpLogo.png"
            alt="logo"
            onClick={onHomeClick}
          />
        </Link>
        {/* <Button
          isWhite={isLinking}
          style={customButtonStyle}
          icon={<ai.AiOutlinePlus />}
          onClick={onCreateNodeButtonClick}
        /> */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search.."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button
            style={searchButtonStyle}
            text="Search"
            icon={<ri.RiSearch2Line />}
            onClick={() => onSearchButtonClick(searchTerm)}
          />
        </div>
        <Link to={'/login'}>
          <Button
            isWhite={isLinking}
            style={loginButtonStyle}
            onClick={onHomeClick}
            text="Login"
          />
        </Link>
      </div>
      {isLinking && startAnchor && (
        <div className="right-bar">
          <div>
            Linking from <b>{nodeIdsToNodesMap[startAnchor.nodeId].title}</b>
          </div>
          <Button
            onClick={handleCancelLink}
            isWhite
            text="Cancel"
            style={{ fontWeight: 600, height: 30, marginLeft: 20 }}
            icon={<ri.RiCloseLine />}
          />
        </div>
      )}
    </div>
  )
}
