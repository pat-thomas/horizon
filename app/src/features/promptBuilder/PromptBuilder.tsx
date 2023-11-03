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
  loadPrompt
} from "./promptBuilderSlice"
import styles from "./PromptBuilder.module.css"
import Button from "react-bootstrap/Button"
import Badge from "react-bootstrap/Badge"
import Stack from "react-bootstrap/Stack"
import Form from "react-bootstrap/Form"
import { useState } from 'react'

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
      part: state.promptBuilder.parts[index],
      settings: state.promptBuilder.settings
    }
  });
  const dispatchData = {index: index};
  const backgroundColorRgb = part.backgroundColor;
  const backgroundColorDiff = 5;
  const {r, g, b} = part.backgroundColor;
  const divBackgroundColorStr = rgbStr({r: r - backgroundColorDiff, g: g - backgroundColorDiff, b: b - backgroundColorDiff})
  const previewBackgroundColorStr = rgbStr(backgroundColorRgb)
  const runDispatch = (handler) => {
    return dispatch(handler(dispatchData))
  }

  return (
    <div style={{'background-color': divBackgroundColorStr, 'color': 'white'}} key={index}>
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
      <p style={{'background-color': previewBackgroundColorStr}}>{part.text}::{part.weight}</p>
    </div>
  )
}

const Output = () => {
  const {
    parts,
    settings
  } = useAppSelector((state) => {
    return {
      parts: state.promptBuilder.parts,
      settings: state.promptBuilder.settings
    }
  });
  const firstPart = parts[0]
  const backgroundColorRgbBase = firstPart.backgroundColor
  const baseBackgroundColorStr = rgbStr(backgroundColorRgbBase)
  return (
    <div id="Output">
      <div style={{'background-color': 'rgb(50, 50, 50)', 'border': '3px solid grey'}}>/imagine&nbsp;</div>
      <div id="OutputText">
        {parts.map((p, index) => {
          const {
            text,
            weight
          } = p;
          const part = parts[index]
          const backgroundColorRgb = part.backgroundColor
          const previewBackgroundColorStr = rgbStr({...backgroundColorRgb})
          const borderColorDiff = -30
          const borderColorStr = rgbStr({
            r: backgroundColorRgb.r + borderColorDiff,
            g: backgroundColorRgb.g + borderColorDiff,
            b: backgroundColorRgb.b + borderColorDiff
          })
          const styleProps = {
            'background-color': previewBackgroundColorStr,
            'borderColor': borderColorStr
          }
          return (
            <div style={{...styleProps}}>
              {text}::{weight}&nbsp;
            </div>
          )
        })}
        <div style={{'background-color': 'rgb(50, 50, 50)', 'border': '3px solid grey'}}>--s {settings.style} --c {settings.chaos}</div>
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

const FetchPrompt = () => {
  const dispatch = useAppDispatch()
  const [idInputState, setIdInputState] = useState('');
  //const loadedPrompts = useAppSelector((state) => state.promptBuilder.loadedPrompts)
  return (
    <Form>
      <Form.Group className="mb-3" controlId="Prompt.Id">
        <Form.Label>Enter prompt ID</Form.Label>
        <Form.Control type="text" onChange={(e) => setIdInputState(e.target.value)} value={idInputState} />
        <Button onClick={() => dispatch(loadPrompt(idInputState))}>Load prompt</Button>
      </Form.Group>
    </Form>
  )
}

const PartBuilder = ({parts}) => {
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
      { fetchPrompt.show && <FetchPrompt /> }
      { settings.show    && <Settings /> }
      { partBuilder.show && <PartBuilder { ...builderProps } /> }
      { output.show      && <Output /> }
      { copyPrompt.show  && <CopyPrompt /> }
    </div>
  )
}

export function PromptBuilder() {
  const dispatch = useAppDispatch()
  const parts = useAppSelector((state) => state.promptBuilder.parts)
  return renderBuilder(parts, {
    fetchPrompt: {
      show: true
    },
    settings: {
      show: false
    },
    partBuilder: {
      show: false
    },
    output: {
      show: true
    },
    copyPrompt: {
      show: false
    }
  })
}
