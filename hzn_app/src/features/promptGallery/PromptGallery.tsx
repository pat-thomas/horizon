import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { useState , useEffect } from 'react'
import Button from "react-bootstrap/Button"
import {
  getPromptList,
  getPromptById
} from "./promptGallerySlice"
import { Route , Navigate } from "react-router-dom"

const defaultPageTitle = 'Prompt Gallery'

const RichPrompt = ({
  promptId
}) => {
  const [showMe, setShowMe] = useState(false)
  const [navigateToBuilder, setNavigateToBuilder] = useState(false)
  const dispatch = useAppDispatch()
  const richPromptData = useAppSelector((state) => state.promptGallery.gallery.richPromptsById[promptId])

  const showAndLoadPrompt = () => {
    setShowMe(true)
    dispatch(getPromptById(promptId))
  }

  useEffect(() => {
    if (showMe) {
      document.title = `Prompt: ${promptId}`
    } else {
      document.title = defaultPageTitle
    }
  })

  if (navigateToBuilder === true) {
    const path = "/builder/prompt/" + promptId
    return (
      <Navigate to={path} />
    )
  } else if (!showMe) {
    return (
      <Button onClick={() => showAndLoadPrompt()}>Show ({promptId})</Button>
    )
  } else {
    return (
      <div key={`RichPrompt.${promptId}`}>
        <Button onClick={() => setShowMe(false)}>Hide</Button>
        <p>ID: {promptId}</p>
        <div>
          <div>
            {richPromptData && richPromptData.parts && richPromptData.parts.map(({text, weight}) => {
              return (
                <p>{text} ::{weight}</p>
              )
            })}
          </div>
          <div>
            {richPromptData && richPromptData.examples && richPromptData.examples.map((ex) => {
              return (
                <img src={ex}></img>
              )
            })}
          </div>
        </div>
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
  useEffect(() => {
    document.title = defaultPageTitle
  })
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
