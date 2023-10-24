import { useState } from "react"

import { useAppSelector, useAppDispatch } from "../../app/hooks"
import {
  addPart,
  removePart,
} from "./promptBuilderSlice"
import styles from "./PromptBuilder.module.css"

export function PromptBuilder() {
  const dispatch = useAppDispatch()
  const parts = useAppSelector((state) => state.promptBuilder.parts);
  console.log(parts);

  return (
    <div>
    <button onClick={() => dispatch(addPart())}>Add part</button>
    {parts.map((data) => {
      return <p>{data.text}</p>
    })}
    </div>
  )
}
