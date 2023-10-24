import { useAppSelector, useAppDispatch } from "../../app/hooks"
import {
  addPart,
  removePart,
  updatePartText,
  incrementPartWeight
} from "./promptBuilderSlice"
import styles from "./PromptBuilder.module.css"

const PromptPart = (props) => {
  const dispatch = useAppDispatch()
  const index = props.index;
  const part = useAppSelector((state) => state.promptBuilder.parts[index]);
  console.log(part)
  return (
    <div key={index} className="promptPart">
      <input type="text" onChange={(e) => dispatch(updatePartText({text: e.target.value, index: index}))} value={part.text} />
      <button onClick={() => dispatch(incrementPartWeight({index: index}))}>Increment weight</button>
      <p>{part.text}::{part.weight}</p>
    </div>
  )
}

export function PromptBuilder() {
  const dispatch = useAppDispatch()
  const parts = useAppSelector((state) => state.promptBuilder.parts)

  return (
    <div>
      <button onClick={() => dispatch(addPart())}>Add part</button>
      {parts.map((data, index) => {
        const promptPartProps = { index: index }
        return <PromptPart { ...promptPartProps } />
      })}
    </div>
  )
}
