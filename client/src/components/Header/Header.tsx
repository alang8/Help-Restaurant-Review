import React, { useEffect, useState } from 'react'
import { Button } from '../Button'
import * as ri from 'react-icons/ri'
import * as ai from 'react-icons/ai'
import * as go from 'react-icons/go'
import { NodeIdsToNodesMap } from '../../types'
import { Link } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  isLinkingState,
  startAnchorState,
  selectedExtentState,
  searchTermState,
  isSearchingState,
  currentNodeState,
} from '../../global/Atoms'
import { Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import './Header.scss'

interface IHeaderProps {
  nodeIdsToNodesMap: NodeIdsToNodesMap
  onCreateNodeButtonClick: () => void
  onSearchButtonClick: (query: string) => void
  onHomeClick: () => void
}

export const Header = (props: IHeaderProps) => {
  const { onHomeClick, onSearchButtonClick, nodeIdsToNodesMap, onCreateNodeButtonClick } =
    props
  const customButtonStyle = { height: 30, marginLeft: 30, width: 30 }
  const searchButtonStyle = {
    height: 30,
    width: 80,
    backgroundColor: '#fff',
    hoverColor: '#000',
  }
  const loginButtonStyle = {
    height: 30,
    marginLeft: 30,
    marginRight: 30,
    width: 220,
    backgroundColor: '#EA3B2E',
    color: '#f5f5f5',
    fontWeight: 'bold',
  }
  const [isLinking, setIsLinking] = useRecoilState(isLinkingState)
  const [startAnchor, setStartAnchor] = useRecoilState(startAnchorState)
  const setSelectedExtent = useSetRecoilState(selectedExtentState)

  // search states
  const [searchTerm, setSearchTerm] = useRecoilState(searchTermState)
  const [isSearching, setIsSearching] = useRecoilState(isSearchingState)

  const nodeKeyHandlers = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        if (searchTerm) {
          setIsSearching(true)
        }
        break
    }
  }

  const handleCancelLink = () => {
    setStartAnchor(null)
    setSelectedExtent(null)
    setIsLinking(false)
  }

  const handleSearch = async () => {
    setIsSearching(true)
  }

  useEffect(() => {
    setIsSearching(false)
  }, [searchTerm])

  useEffect(() => {
    document.addEventListener('keydown', nodeKeyHandlers)
  }, [searchTerm])

  return (
    <div className={isLinking ? 'header-linking' : 'header'}>
      <div className="left-bar">
        <Link to={'/'}>
          <img
            className="logo"
            src="../../logo.png"
            alt="logo"
            onClick={onHomeClick}
            style={{ width: '150px' }}
          />
        </Link>
        <InputGroup>
          <Input
            style={{ height: 32, marginLeft: 10, backgroundColor: '#fff' }}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search"
          />
          <InputRightElement width="3rem" style={{ marginTop: '-4px' }}>
            <Button
              style={{ height: 28, width: 44 }}
              icon={<go.GoSearch />}
              onClick={handleSearch}
            />
          </InputRightElement>
        </InputGroup>
        <Link to={'/login'}>
          <Button
            isWhite={isLinking}
            style={loginButtonStyle}
            onClick={onCreateNodeButtonClick}
            text="Register Your Restaurant"
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
