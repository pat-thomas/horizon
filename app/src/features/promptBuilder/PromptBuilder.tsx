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
  useLoadedPromptToSetBuilder,
  defaultRgb
} from "./promptBuilderSlice"
import styles from "./PromptBuilder.module.css"
import Button from "react-bootstrap/Button"
import Badge from "react-bootstrap/Badge"
import Stack from "react-bootstrap/Stack"
import Form from "react-bootstrap/Form"
import { useState , useEffect } from 'react'
import { useParams } from "react-router-dom"

const rgbStr = ({r, g, b}) => {
  return `rgb(${r}, ${g}, ${b})`
}

const copyPromptPart = (text) => {
  navigator.clipboard.writeText(text)
}

const PromptPart = (props) => {
  const dispatch = useAppDispatch()
  const index = props.index;
  const {
    part,
    settings
  } = useAppSelector((state) => {
    return {
      part: state.promptBuilder.activePrompt.parts[index],
      settings: state.promptBuilder.settings
    }
  });
  const dispatchData = {index: index};
  let prevColor;
  if (index >= 1 && part[index-1] && part[index-1].backgroundColor) {
    prevColor = part[index-1].backgroundColor
  }
  let backgroundColorRgb;
  if (prevColor) {
    backgroundColorRgb = nextColor(prevColor)
  } else {
    backgroundColorRgb = part.backgroundColor || defaultRgb
  }

  console.log('backgroundColorRgb', backgroundColorRgb)

  const backgroundColorDiff = 5;
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
          <Form.Label>Enter/modify prompt part</Form.Label>
          <Form.Control type="text" onChange={(e) => dispatch(updatePartText({text: e.target.value, index: index}))} value={part.text} />
        </Form.Group>
      </Form>
      <Button onClick={() => runDispatch(incrementPartWeight)}>+ weight ({settings.weightDifference})</Button>
      <Button onClick={() => runDispatch(decrementPartWeight)}>- weight ({settings.weightDifference})</Button>
      <Button onClick={() => runDispatch(removePart)}>- part</Button>
      <Button onClick={() => copyPromptPart(part.text) }>Copy part to clipboard</Button>
      <p style={{'backgroundColor': previewBackgroundColorStr}}>{part.text} ::{part.weight}</p>
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
            <div>
              {text} ::{weight}&nbsp;
            </div>
          )
        })}
        <div style={{'backgroundColor': 'rgb(120, 120, 130)', 'border': '3px solid grey'}}>--s {settings.style} --c {settings.chaos}</div>
      </div>
    </div>
  )
}

const Settings = () => {
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
  fetchForm
}) => {
  const dispatch = useAppDispatch()
  const [idInputState, setIdInputState] = useState('')
  const loadedPrompts = useAppSelector((state) => state.promptBuilder.loadedPrompts)
  const activePrompt = useAppSelector((state) => state.promptBuilder.activePrompt)
  const handleGetPromptClick = () => {
    dispatch(getPromptById(idInputState))
  }
  const handleSelect = (promptId) => {
    dispatch(useLoadedPromptToSetBuilder(promptId))
  }
  return (
    <div className={styles.FetchPrompt}>
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
              <Button onClick={() => handleSelect(lp.id)}>Select prompt to build ({lp.id})</Button>
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

const PartBuilder = ({parts}) => {
  const dispatch = useAppDispatch()
  return (
    <div>
      {parts.map((data, index) => {
        const promptPartProps = { index: index }
        return <PromptPart { ...promptPartProps } />
      })}
      <Button onClick={() => dispatch(addPart())}>+ part</Button>
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

const renderBuilder = (parts, uiConfig) => {
  const {
    settings,
    fetchPrompt,
    partBuilder,
    output,
    copyPrompt
  } = uiConfig;
  const builderProps = { parts: parts };
  return (
    <div>
      { fetchPrompt.show && <FetchPrompt { ...fetchPrompt } /> }
      { settings.show    && <Settings /> }
      { partBuilder.show && <PartBuilder { ...builderProps } /> }
      { output.show      && <Output /> }
      { copyPrompt.show  && <CopyPrompt /> }
    </div>
  )
}

export function PromptBuilder() {
  const dispatch = useAppDispatch()
  const parts = useAppSelector((state) => state.promptBuilder.activePrompt.parts)
  const { promptId } = useParams()
  return renderBuilder(parts, {
    fetchPrompt: {
      show: true,
      fetchForm: true,
      preview: true
    },
    settings: {
      show: false
    },
    partBuilder: {
      show: true
    },
    output: {
      show: true
    },
    copyPrompt: {
      show: true
    }
  })
}
