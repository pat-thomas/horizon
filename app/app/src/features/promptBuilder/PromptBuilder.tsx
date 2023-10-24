import { useAppSelector, useAppDispatch } from "../../app/hooks"
import {
  addPart,
  removePart,
  updatePartText,
  incrementPartWeight,
  decrementPartWeight
} from "./promptBuilderSlice"
import styles from "./PromptBuilder.module.css"

const PromptPart = (props) => {
  const dispatch = useAppDispatch()
  const index = props.index;
  const part = useAppSelector((state) => state.promptBuilder.parts[index]);
  console.log(part)
  return (
    <div key={index} className={styles.PromptPart}>
      <input className={styles.PartInput} type="text" onChange={(e) => dispatch(updatePartText({text: e.target.value, index: index}))} value={part.text} />
      <button className={styles.PartButton} onClick={() => dispatch(incrementPartWeight({index: index}))}>Increment weight</button>
      <button className={styles.PartButton} onClick={() => dispatch(decrementPartWeight({index: index}))}>Decrement weight</button>
      <p className={styles.PromptPartPreview}>{part.text}::{part.weight}</p>
    </div>
  )
}

const Output = () => {
  const parts = useAppSelector((state) => state.promptBuilder.parts)
  console.log(parts);
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

export function PromptBuilder() {
  const dispatch = useAppDispatch()
  const parts = useAppSelector((state) => state.promptBuilder.parts)

  return (
    <div>
      <div className="promptBuilder">
        <button onClick={() => dispatch(addPart())}>Add part</button>
        {parts.map((data, index) => {
          const promptPartProps = { index: index }
          return <PromptPart { ...promptPartProps } />
        })}
      </div>
      <Output />
    </div>
  )
}
