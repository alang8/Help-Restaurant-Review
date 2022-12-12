import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  alertMessageState,
  alertOpenState,
  alertTitleState,
  isSearchingState,
  searchTermState,
} from '../../../../global/Atoms'
import { FrontendNodeGateway } from '../../../../nodes'
import {
  failureServiceResponse,
  successfulServiceResponse,
  INode,
} from '../../../../types'
import './SearchContent.scss'
import { Checkbox, Stack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { pathToString } from '../../../../global'

/** The contents of search result */
export const SearchContent = () => {
  const setAlertIsOpen = useSetRecoilState(alertOpenState)
  const setAlertTitle = useSetRecoilState(alertTitleState)
  const setAlertMessage = useSetRecoilState(alertMessageState)

  const searchTerm = useRecoilValue(searchTermState)
  const [isSearching, setIsSearching] = useRecoilState(isSearchingState)
  const [searchResults, setSearchResults] = useState<INode[]>([])
  const [filteredSearchResults, setFilteredSearchResults] = useState<INode[]>([])

  const [byDate, sortByDate] = useState<boolean>(false)
  const [textNodes, displayTextNodes] = useState<boolean>(true)
  const [imageNodes, displayImageNodes] = useState<boolean>(true)
  const [restaurantNodes, displayRestaurantNodes] = useState<boolean>(true)

  const handleSearchResults = async () => {
    const resultsResp = await FrontendNodeGateway.getSearchResults(searchTerm)
    if (!resultsResp.success) {
      return failureServiceResponse('failed to get search results')
    }
    if (!resultsResp.payload) {
      return successfulServiceResponse('no search results to display')
    } else {
      setSearchResults(resultsResp.payload)
      setFilteredSearchResults(resultsResp.payload)
    }
  }

  const handleSelectResult = async (nodeId: string) => {
    const nodeResp = await FrontendNodeGateway.getNode(nodeId)
    if (!nodeResp.success) {
      setAlertIsOpen(true)
      setAlertTitle('Failed to fetch node')
      setAlertMessage(nodeResp.message)
    }
    if (nodeResp.payload) {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    handleSearchResults()
  }, [isSearching])

  useEffect(() => {
    setFilteredSearchResults(
      searchResults
        .filter(
          (a) =>
            (textNodes && a.type === 'text') ||
            (imageNodes && a.type === 'image') ||
            (restaurantNodes && a.type === 'restaurant')
        )
        .sort((a, b) =>
          byDate
            ? (new Date(a.dateCreated ?? 0).getTime() ?? 0) >
              (new Date(b.dateCreated ?? 0).getTime() ?? 0)
              ? -1
              : 1
            : 0
        )
    )
  }, [byDate, textNodes, imageNodes, restaurantNodes])

  return (
    <div className="searchWrapper">
      <Stack spacing={5} direction="row" style={{ margin: '0px 10px 10px' }}>
        <Checkbox isChecked={byDate} onChange={(e) => sortByDate(e.target.checked)}>
          Sort by Date Created
        </Checkbox>
        <Checkbox
          defaultChecked
          isChecked={textNodes}
          onChange={(e) => displayTextNodes(e.target.checked)}
        >
          Text Nodes
        </Checkbox>
        <Checkbox
          defaultChecked
          isChecked={imageNodes}
          onChange={(e) => displayImageNodes(e.target.checked)}
        >
          Image Nodes
        </Checkbox>
        <Checkbox
          defaultChecked
          isChecked={restaurantNodes}
          onChange={(e) => displayRestaurantNodes(e.target.checked)}
        >
          Restaurant Nodes
        </Checkbox>
      </Stack>
      {filteredSearchResults.length === 0 ? (
        <pre>
          {`No results...
              __
            / ^_)
     .-^^^-/ /
  __/       /
 <__.|_|-|_|
       `}
        </pre>
      ) : (
        filteredSearchResults.map((result) => (
          <Link
            to={`/${pathToString(result.filePath)}`}
            key={result.nodeId}
            onClick={() => {
              handleSelectResult(result.nodeId)
            }}
          >
            <div className="resultItem">
              <div className="resultBody">
                <div className="resultNode">
                  {result.type} node created at {result.dateCreated}
                </div>
                <div className="resultTitle">
                  <a href="#">{result.title}</a>
                </div>
                {result.type === 'restaurant' ? (
                  <div className="resultContent">{result.content.description}</div>
                ) : (
                  <div className="resultContent">{result.content}</div>
                )}
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}
