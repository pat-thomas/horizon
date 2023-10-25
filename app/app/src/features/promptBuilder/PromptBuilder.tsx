import { useAppSelector, useAppDispatch } from "../../app/hooks"
import {
  addPart,
  removePart,
  updatePartText,
  incrementPartWeight,
  decrementPartWeight,
  updateSettingWeightDifference,
  updateSettingStyle,
  updateSettingChaos
} from "./promptBuilderSlice"
import styles from "./PromptBuilder.module.css"

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
  return (
    <div className={styles.PromptPart} style={{'background-color': divBackgroundColorStr}} key={index}>
      <input className={styles.PartInput} type="text" onChange={(e) => dispatch(updatePartText({text: e.target.value, index: index}))} value={part.text} />
      <button className={styles.PartButton} onClick={() => dispatch(incrementPartWeight(dispatchData))}>+ weight ({settings.weightDifference})</button>
      <button className={styles.PartButton} onClick={() => dispatch(decrementPartWeight(dispatchData))}>- weight ({settings.weightDifference})</button>
      <button className={styles.PartButton} onClick={() => dispatch(removePart(dispatchData))}>- part</button>
      <button className={styles.PartButton} onClick={() => copyPromptPart(part.text) }>Copy part to clipboard</button>
      <p style={{'background-color': previewBackgroundColorStr}} className={styles.PromptPartPreview}>{part.text}::{part.weight}</p>
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
    <div id="Output" className={styles.Output}>
      <div className={styles.OutputPartPreview} style={{'background-color': 'rgb(50, 50, 50)', 'border': '3px solid grey'}}>/imagine&nbsp;</div>
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
            <div className={styles.OutputPartPreview} style={{...styleProps}}>
              {text}::{weight}&nbsp;
            </div>
          )
        })}
        <div className={styles.OutputPartPreview} style={{'background-color': 'rgb(50, 50, 50)', 'border': '3px solid grey'}}>--s {settings.style} --c {settings.chaos}</div>
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
    <div className={styles.Settings}>
      <div>
        <label>Set weight difference</label>
        <input type="text" onChange={(e) => dispatch(updateSettingWeightDifference(e.target.value))} value={weightDifference} />
      </div>
      <div>
        <label>Set style</label>
        <input type="text" onChange={(e) => dispatch(updateSettingStyle(e.target.value))} value={style} />
      </div>
      <div>
        <label>Set chaos</label>
        <input type="text" onChange={(e) => dispatch(updateSettingChaos(e.target.value))} value={chaos} />
      </div>
    </div>
  )
}

export function PromptBuilder() {
  const dispatch = useAppDispatch()
  const parts = useAppSelector((state) => state.promptBuilder.parts)

  return (
    <div>
      <Settings />
      <div className="promptBuilder">
        {parts.map((data, index) => {
          const promptPartProps = { index: index }
          return <PromptPart { ...promptPartProps } />
        })}
        <button onClick={() => dispatch(addPart())}>+ part</button>
      </div>
      <Output />
      <div>
        <button onClick={() => {
          navigator.clipboard.writeText(document.getElementById("OutputText").textContent)
            .then(() => {
            })
        }}>Copy prompt to clipboard</button>
      </div>
    </div>
  )
}
