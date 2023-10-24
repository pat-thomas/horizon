import { useAppSelector, useAppDispatch } from "../../app/hooks"
import {
  addPart,
  removePart,
  updatePartText,
  incrementPartWeight,
  decrementPartWeight,
  updateSettingWeightDifference
} from "./promptBuilderSlice"
import styles from "./PromptBuilder.module.css"


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
  return (
    <div key={index} className={styles.PromptPart}>
      <input className={styles.PartInput} type="text" onChange={(e) => dispatch(updatePartText({text: e.target.value, index: index}))} value={part.text} />
      <button className={styles.PartButton} onClick={() => dispatch(incrementPartWeight(dispatchData))}>+ weight ({settings.weightDifference})</button>
      <button className={styles.PartButton} onClick={() => dispatch(decrementPartWeight(dispatchData))}>- weight ({settings.weightDifference})</button>
      <button className={styles.PartButton} onClick={() => dispatch(removePart(dispatchData))}>- part</button>
      <p className={styles.PromptPartPreview}>{part.text}::{part.weight}</p>
    </div>
  )
}

const Output = () => {
  const parts = useAppSelector((state) => state.promptBuilder.parts)
  let outputStr = ''
  parts.forEach((p) => {
    const {
      text,
      weight
    } = p;
    outputStr += `${text}::${weight} `
  });
  outputStr = '/imagine ' + outputStr
  return (
    <div className={styles.Output}>
      <p>{outputStr}</p>
    </div>
  )
}

const Settings = () => {
  const dispatch = useAppDispatch()
  const settings = useAppSelector((state) => state.promptBuilder.settings)
  return (
    <div className={styles.Settings}>
      <div>
        <label>Weight difference</label>
        <input type="text" onChange={(e) => dispatch(updateSettingWeightDifference(e.target.value))} value={settings.weightDifference} />
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
    </div>
  )
}
