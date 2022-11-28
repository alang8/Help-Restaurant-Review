import React, { useEffect, useState } from 'react'
import { INode } from '../../types'
import './Search.scss'
import { Search } from './Search'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

interface ISearchListProps {
  searchResults: INode[]
}
export const SearchView = ({ searchResults }: ISearchListProps) => {
  const [filteredNodes, setFilteredNodes] = useState<INode[]>([])
  const [nodeTypeFilter, setNodeTypeFilter] = useState<string>('0')
  const [dateCreatedSort, setDateCreatedSort] = useState<string>('0')

  const handleNodeTypeFilter = (event: SelectChangeEvent) => {
    setNodeTypeFilter(event.target.value)
  }
  const handleDateCreatedSort = (event: SelectChangeEvent) => {
    setDateCreatedSort(event.target.value)
  }

  useEffect(() => {
    let filteredNodes: INode[] = [...searchResults]
    // Filter by node type
    if (nodeTypeFilter == '1') {
      filteredNodes = filteredNodes.filter((node) => node.type == 'image')
    } else if (nodeTypeFilter == '2') {
      filteredNodes = filteredNodes.filter((node) => node.type == 'text')
    } else if (nodeTypeFilter == '3') {
      filteredNodes = filteredNodes.filter((node) => node.type == 'folder')
    }
    // Sort by date created
    if (dateCreatedSort != '0') {
      filteredNodes = filteredNodes.sort((a, b) => {
        if (dateCreatedSort == '1') {
          return a!.dateCreated! > b!.dateCreated! ? 1 : -1
        } else {
          return a!.dateCreated! < b!.dateCreated! ? 1 : -1
        }
      })
    }
    setFilteredNodes(filteredNodes)
  }, [nodeTypeFilter, dateCreatedSort, searchResults])

  return (
    <div className="search-container">
      <div className="filter-container">
        <h1>Search Results</h1>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-standard-label">
            Filter by Node Type
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={nodeTypeFilter}
            onChange={handleNodeTypeFilter}
            label="Filter by Node Type"
          >
            <MenuItem value={0}>All</MenuItem>
            <MenuItem value={1}>Image</MenuItem>
            <MenuItem value={2}>Text</MenuItem>
            <MenuItem value={3}>Folder</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-standard-label">Sort</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={dateCreatedSort}
            onChange={handleDateCreatedSort}
            label="Sort"
          >
            <MenuItem value={0}>Sort by Relevance</MenuItem>
            <MenuItem value={1}>Ascending (Oldest to Newest)</MenuItem>
            <MenuItem value={2}>Descending (Newest to Oldest)</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="search-results-container">
        {filteredNodes.length > 0 ? (
          filteredNodes.map((node, idx) => <Search node={node} key={idx} />)
        ) : (
          <div>No results found</div>
        )}
      </div>
    </div>
  )
}
