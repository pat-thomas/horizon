import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { useState , useEffect } from "react"
import { Route , Navigate } from "react-router-dom"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import {
  getTourById
} from "./tourBuilderSlice"

const TourSelector = ({
}) => {
  const dispatch = useAppDispatch()
  const {
    activeTour,
    loadedTours
  } = useAppSelector(state => state.tourBuilder)
  const [tourIdInput, setTourIdInput] = useState('default')

  if (activeTour && activeTour.id) {
    // TODO make this a Navigate
    return <></>
  } else {
    return (
      <div>
        <Form>
          <Form.Group>
            <Form.Label>Enter Tour ID</Form.Label>
            <Form.Control type="text" onChange={(e) => setTourIdInput(e.target.value)} value={tourIdInput} />
          </Form.Group>
        </Form>
        <Button onClick={() => dispatch(getTourById(tourIdInput))}>Load Tour</Button>
      </div>
    )
  }
}

const RoomTraversalButton = ({
  room,
  direction,
  lastRoom,
  currentRoomId,
  setCurrentRoomId,
  setLastRoom,
  home
}) => {
  const nextRoomId = room[direction]
  const clickHandler = () => {
    setLastRoom({...room, id: currentRoomId})
    if (home) {
      setCurrentRoomId("_start")
    } else {
      setCurrentRoomId(nextRoomId)
    }
  }
  if (home) {
    return (
      <Button onClick={clickHandler}>Go Home</Button>
    )
  } else if (!nextRoomId) {
    return (
      <Button disabled>Go {direction}</Button>
    )
  } else {
    return (
      <Button onClick={clickHandler}>Go {direction}</Button>
    )
  }
}

const TourViewer = ({
  activeTour
}) => {
  if (!activeTour) {
    return (
      <>
      </>
    )
  }
  const [currentRoomId, setCurrentRoomId] = useState('_start')
  const [lastRoom, setLastRoom] = useState({})
  const { rooms , settings } = activeTour
  const currentRoom = rooms[currentRoomId]

  const undo = () => {
    if (lastRoom) {
      setCurrentRoomId(lastRoom.id)
    }
  }

  const btnProps = {
    room: currentRoom,
    currentRoomId: currentRoomId,
    setCurrentRoomId: setCurrentRoomId,
    lastRoom: lastRoom,
    setLastRoom: setLastRoom
  }
  const fwdProps = { ...btnProps, direction: "forward" }
  const bwdProps = { ...btnProps, direction: "backward" }
  const leftProps = { ...btnProps, direction: "left" }
  const rightProps = { ...btnProps, direction: "right" }
  const homeProps = { ...btnProps, home: true }
  return (
    <div>
      <p>Tour ({activeTour.id})</p>
      <p>&nbsp;&nbsp;{currentRoom.caption}</p>
      <RoomTraversalButton { ...fwdProps } />
      <RoomTraversalButton { ...bwdProps } />
      <RoomTraversalButton { ...leftProps } />
      <RoomTraversalButton { ...rightProps } />
      <RoomTraversalButton { ...homeProps } />
      <img src={currentRoom.src} />
    </div>
  )
}

export function TourBuilder() {
  const {
    activeTour,
    loadedTours
  } = useAppSelector((state) => state.tourBuilder)
  const tourViewerProps = {
    activeTour: activeTour
  }
  return (
    <div>
      <TourSelector />
      <TourViewer { ...tourViewerProps } />
    </div>
  )
}
