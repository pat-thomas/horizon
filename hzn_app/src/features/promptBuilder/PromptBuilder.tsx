import { useAppSelector, useAppDispatch } from "../../app/hooks"
import {
  addPart,
  removePart,
  updatePartText,
  incrementPartWeight,
  decrementPartWeight,
  updateSettingWeightDifference,
  updateSettingStyle,
  updateSettingChaos,
  getPromptById,
  getRandomPrompt,
  savePrompt,
  useLoadedPromptToSetBuilder,
  defaultRgb
} from "./promptBuilderSlice"
import styles from "./PromptBuilder.module.css"

import Button from "react-bootstrap/Button"
import Badge from "react-bootstrap/Badge"
import Stack from "react-bootstrap/Stack"
import Form from "react-bootstrap/Form"
import Dropdown from "react-bootstrap/Dropdown"

import { useState , useEffect } from 'react'
import { useParams } from "react-router-dom"

const rgbStr = ({r, g, b}) => {
  return `rgb(${r}, ${g}, ${b})`
}

const copyPromptPart = (text) => {
  navigator.clipboard.writeText(text)
}

const promptPartTypeInternal = {
  "plaintext": "Plaintext",
  "randomdata.beers": "Random Beer (Random Data API)",
  "randomdata.users": "Random User (Random Data API)"
}

const FriendlyDropdownType = ({
  eventKey
}) => {
  return <Dropdown.Item eventKey={eventKey}>{promptPartTypeInternal[eventKey]}</Dropdown.Item>
}

const AdvancedButtons = ({
  promptPartType,
  index
}) => {
  const dispatch = useAppDispatch()
  const handleClickLoadRandomData = () => {
  }
  const dataTypeForApi = () => {
    return promptPartType.split("randomdata.")[1]
  }

  const loadRandomPrompt = () => {
    dispatch(getRandomPrompt({
      dataType: dataTypeForApi(),
      promptIndex: index
    }))
  }

  if (promptPartType.startsWith("randomdata.")) {
    return (
      <div>
        <Button onClick={loadRandomPrompt}>Generate Random Prompt Part ({dataTypeForApi()})</Button>
      </div>
    )
  } else {
    return <></>
  }
}

const AdvancedPromptPartGenerator = ({
  index
}) => {
  const dispatch = useAppDispatch()
  const [dataTypeInput, setDataTypeInput] = useState('beers')
  const [partTypeSelection, setPartTypeSelection] = useState('plaintext')

  const handleDropdownChange = (evt) => {
    const recognizedType = promptPartTypeInternal[evt]
    if (!recognizedType) {
    } else {
      setPartTypeSelection(evt)
    }
  }

  const advancedButtonProps = {
    promptPartType: partTypeSelection,
    index: index
  }

  return (
    <div>
      <p>Type: {promptPartTypeInternal[partTypeSelection]}</p>
      <Dropdown onSelect={handleDropdownChange}>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Select prompt part type
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <FriendlyDropdownType eventKey="plaintext" />
          <FriendlyDropdownType eventKey="randomdata.beers" />
          <FriendlyDropdownType eventKey="randomdata.users" />
        </Dropdown.Menu>
      </Dropdown>
      <div>
        <AdvancedButtons { ...advancedButtonProps } />
      </div>
    </div>
  )
}

const AdvancedPartSettings = ({
  index
}) => {
  const dispatch = useAppDispatch()
  //const [dataTypeInput, setDataTypeInput] = useState('beers')
  const [showMe, setShowMe] = useState(false)

  if (!showMe) {
    return <div> <Button onClick={() => setShowMe(true)}>Advanced</Button> </div>
  } else {
    return (
      <div>
        <Button onClick={() => setShowMe(false)}>Hide Advanced</Button>
        <AdvancedPromptPartGenerator index={index} />
      </div>
    )
  }
}

const PromptPart = (props) => {
  const dispatch = useAppDispatch()
  const index = props.index
  const {
    part,
    settings
  } = useAppSelector((state) => {
    return {
      part: state.promptBuilder.activePrompt.parts[index],
      settings: state.promptBuilder.settings
    }
  });
  const dispatchData = {index: index}
  let prevColor
  if (index >= 1 && part[index-1] && part[index-1].backgroundColor) {
    prevColor = part[index-1].backgroundColor
  }
  let backgroundColorRgb
  if (prevColor) {
    backgroundColorRgb = nextColor(prevColor)
  } else {
    backgroundColorRgb = part.backgroundColor || defaultRgb
  }

  const backgroundColorDiff = 5
  const {r, g, b} = backgroundColorRgb
  const divBackgroundColorStr = rgbStr({r: r - backgroundColorDiff, g: g - backgroundColorDiff, b: b - backgroundColorDiff})
  const previewBackgroundColorStr = rgbStr(backgroundColorRgb)
  const runDispatch = (handler) => {
    return dispatch(handler(dispatchData))
  }

  return (
    <div style={{'backgroundColor': divBackgroundColorStr, 'color': 'white'}} key={index}>
      <Form>
        <Form.Group>
          <Form.Control type="text" onChange={(e) => dispatch(updatePartText({text: e.target.value, index: index}))} value={part.text} />
        </Form.Group>
      </Form>
      <div>
        <label>Adjust weight ({settings.weightDifference}) &nbsp;</label>
        <Button onClick={() => runDispatch(incrementPartWeight)}>+</Button>
        <Button onClick={() => runDispatch(decrementPartWeight)}>-</Button>
      </div>
      <Button onClick={() => runDispatch(removePart)}>Delete part</Button>
      <Button onClick={() => copyPromptPart(part.text) }>Copy part to clipboard</Button>
      <AdvancedPartSettings { ...props } />
    </div>
  )
}

const Output = () => {
  const {
    parts,
    settings
  } = useAppSelector((state) => {
    return {
      parts: state.promptBuilder.activePrompt.parts,
      settings: state.promptBuilder.settings
    }
  });
  const firstPart = parts[0]
  return (
    <div id="Output">
      <div style={{'backgroundColor': 'rgb(120, 120, 130)', 'border': '3px solid grey'}}>/imagine&nbsp;</div>
      <div id="OutputText">
        {parts.map((p, index) => {
          const {
            text,
            weight
          } = p;
          const part = parts[index]
          return (
            <div key={'Output.' + index}>
              {text} ::{weight}&nbsp;
            </div>
          )
        })}
        <div style={{'backgroundColor': 'rgb(120, 120, 130)', 'border': '3px solid grey'}}>--s {settings.style} --c {settings.chaos}</div>
      </div>
    </div>
  )
}

const UniversalSettings = () => {
  const dispatch = useAppDispatch()
  const settings = useAppSelector((state) => state.promptBuilder.settings)
  const {
    weightDifference,
    style,
    chaos
  } = settings
  return (
    <Form>
      <Form.Group className="mb-3" controlId="Settings.WeightDifference">
        <Form.Label>Set weight difference</Form.Label>
        <Form.Control type="text" onChange={(e) => dispatch(updateSettingWeightDifference(e.target.value))} value={weightDifference} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="Settings.WeightDifference">
        <Form.Label>Set style</Form.Label>
        <Form.Control type="text" onChange={(e) => dispatch(updateSettingStyle(e.target.value))} value={style} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="Settings.WeightDifference">
        <Form.Label>Set chaos</Form.Label>
        <Form.Control type="text" onChange={(e) => dispatch(updateSettingChaos(e.target.value))} value={chaos} />
      </Form.Group>
    </Form>
  )
}

const FetchPrompt = ({
  preview,
  fetchForm,
  collapse
}) => {
  const dispatch = useAppDispatch()
  const [idInputState, setIdInputState] = useState('')
  const [showMe, setShowMe] = useState(collapse === false)
  const loadedPrompts = useAppSelector((state) => state.promptBuilder.loadedPrompts)
  const activePrompt = useAppSelector((state) => state.promptBuilder.activePrompt)
  const handleGetPromptClick = () => dispatch(getPromptById(idInputState))
  const handleSelect = (promptId) => dispatch(useLoadedPromptToSetBuilder(promptId))
  if (!showMe) {
    return (
      <Button className={styles.customBtn} onClick={() => setShowMe(true)}>Show prompt loader</Button>
    )
  } else {
    return (
      <div className={styles.FetchPrompt}>
        <Button className={styles.customBtn} onClick={() => setShowMe(false)}>Hide prompt loader</Button>
        {fetchForm &&
          <Form>
            <Form.Group className="mb-3" controlId="Prompt.Id">
              <Form.Label>Enter prompt ID</Form.Label>
              <Form.Control type="text" onChange={(e) => setIdInputState(e.target.value)} value={idInputState} />
              <Button onClick={() => handleGetPromptClick()}>Load prompt</Button>
            </Form.Group>
          </Form>
        }
        <div>
          {activePrompt &&
            <p>Current active prompt: {activePrompt.id}</p>
          }
          {loadedPrompts.map((lp) => {
            return (
              <div className={styles.FetchPromptPreview}>
                <Button onClick={() => handleSelect(lp.id)}>Build with ({lp.id})</Button>
                <div className="FetchPromptParts">
                {lp.parts && lp.parts.map((p, idx) => {
                  return (
                    <p>&nbsp;&nbsp;&nbsp;{p.text} ::{p.weight}</p>
                  )
                })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

const Parts = ({parts}) => {
  return <div> {parts.map((data, index) => <PromptPart key={'PromptPart.' + index} index={index} /> )} </div>
}

const PartTool = () => {
}

const PartBuilder = ({parts}) => {
  const dispatch = useAppDispatch()

  return (
    <div>
      <Parts parts={parts} />
      <div>
        <Button onClick={() => dispatch(addPart())}>Add part</Button>
      </div>
    </div>
  )
}

const CopyPrompt = () => {
  return (
    <div>
      <Button
        onClick={() => {
          navigator.clipboard.writeText(document.getElementById("OutputText").textContent)
            .then(() => {
            })
        }}>
        Copy prompt to clipboard
      </Button>
    </div>
  )
}

const AppHistory = () => {
  const dispatch = useAppDispatch()
  const appHistory = useAppSelector((state) => state.promptBuilder.appHistory)
  const rolledUpHistory = useAppSelector((state) => state.promptBuilder.rolledUpHistory)

  return (
    <div>
      <div>
        <p>History Entries:</p>
        {appHistory && appHistory.map((historyObj, index) => {
          console.log('rendering history object', historyObj)
          return (
            <div>
              <p>{index} [ {historyObj.name} ]: {JSON.stringify(historyObj.data, null, 2)}</p>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div>
      <div>
        <p>Rolled up history:</p>
        <p>{JSON.stringify(rolledUpHistory, null, 2)}</p>
      </div>

      <div>
        <p>History Entries:</p>
        {appHistory && appHistory.map((historyObj, index) => {
          console.log(historyObj)
          return (
            <div>
              <p>{index} [ {historyObj.name} ]: {JSON.stringify(historyObj.data, null, 2)}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const SavePrompt = () => {
  const dispatch = useAppDispatch()
  const activePrompt = useAppSelector((state) => state.promptBuilder.activePrompt)

  const [promptIdInputState, setPromptIdInputState] = useState('custom-1')

  const handleClickSavePrompt = () => {
    dispatch(savePrompt({
      promptId: promptIdInputState,
      promptData: activePrompt
    }))
  }

  return (
    <div>
      <Form>
        <Form.Group>
          <Form.Label>Enter prompt ID to Save</Form.Label>
          <Form.Control type="text" value={promptIdInputState} onChange={(e) => setPromptIdInputState(e.target.value)}></Form.Control>
          <Button onClick={handleClickSavePrompt}>Save Prompt</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

const renderBuilder = (parts, uiConfig) => {
  return (
    <div>
      { uiConfig.fetchPrompt.show && <FetchPrompt { ...uiConfig.fetchPrompt } /> }
      { uiConfig.settings.show    && <UniversalSettings /> }
      { uiConfig.partBuilder.show && <PartBuilder parts={parts} /> }
      { uiConfig.output.show      && <Output /> }
      { uiConfig.copyPrompt.show  && <CopyPrompt /> }
      { uiConfig.savePrompt.show  && <SavePrompt /> }
      { uiConfig.appHistory.show  && <AppHistory /> }
    </div>
  )
}

export function PromptBuilder() {
  const dispatch = useAppDispatch()
  const parts = useAppSelector((state) => state.promptBuilder.activePrompt.parts)
  const { promptId } = useParams()
  return renderBuilder(parts, {
    fetchPrompt: {
      show: false,
      fetchForm: true,
      preview: true,
      collapse: true
    },
    settings: {
      show: true
    },
    partBuilder: {
      show: true,
      collapse: true
    },
    output: {
      show: true
    },
    copyPrompt: {
      show: true
    },
    savePrompt: {
      show: true
    },
    appHistory: {
      show: true
    }
  })
}
