import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { useState , useEffect } from 'react'
import Button from "react-bootstrap/Button"
import {
  getPromptList
} from "./promptGallerySlice"
import { Route , Navigate } from "react-router-dom"

const RichPrompt = ({
  promptId
}) => {
  const [showMe, setShowMe] = useState(false)
  const [navigateToBuilder, setNavigateToBuilder] = useState(false)
  if (navigateToBuilder === true) {
    const path = "/builder/prompt/" + promptId
    return (
      <Navigate to={path} />
    )
  } else if (!showMe) {
    return (
      <Button onClick={() => setShowMe(true)}>Show ({promptId})</Button>
    )
  } else {
    return (
      <div>
        <Button onClick={() => setShowMe(false)}>Hide</Button>
        <p>ID: {promptId}</p>
        <p>The rich prompt data for prompt {promptId} will go here</p>
        <Button onClick={() => setNavigateToBuilder(true)}>Use in Builder</Button>
      </div>
    )
  }
}

const PromptList = ({
  loadedData
}) => {
  const {
    loading,
    promptIds
  } = loadedData

  return (
    <div>
    {promptIds.data.map((id) => {
      const richPromptProps = { promptId: id }
      return (
        <div>
          <RichPrompt { ...richPromptProps } />
        </div>
      )
    })}
    </div>
  )
}


const ListHydrator = ({
}) => {
  const dispatch = useAppDispatch()
  const handleLoadAllPromptsClick = () => {
    dispatch(getPromptList())
  }
  return (
    <div>
      <Button onClick={() => handleLoadAllPromptsClick()}>Load all Prompts</Button>
    </div>
  )
}

export function PromptGallery() {
  const dispatch = useAppDispatch()
  const {
    loadedData,
    richPromptData
  } = useAppSelector((state) => state.promptGallery)
  const listProps = { loadedData: loadedData }
  return (
    <div>
      <PromptList { ...listProps } />
      <ListHydrator { ...listProps } />
    </div>
  )
}
