import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import "./Column.css";
import Task from "./Task";
import classNames from "classnames";

export default function Column({ state }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);


  const tasks = useStore((store) =>
    store.tasks.filter((task) => task.state === state)
  );

  const setDraggedTask = useStore((store) => store.setDraggedTask);
  const draggedTask = useStore((store) => store.draggedTask);
  const moveTask = useStore((store) => store.moveTask);
  const addTask = useStore((store) => store.addTask);

  return (
    <div
      className={classNames('column', {drop:drop})}
      onDragOver={(e) => {
        setDrop(true)
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        setDrop(false)
        e.preventDefault();
      }}
      onDrop={(e) => {
        moveTask(draggedTask, state);
        setDraggedTask(null);
      }}
    >
      <div className="titleWrapper">
        <p>{state}</p>
        <button onClick={() => setOpen(true)}>ADD</button>
      </div>
      {tasks.map((task) => (
        <Task title={task.title} key={task.title} />
      ))}

      {open && (
        <div className="Modal">
          <div className="modalContent">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              required={true}
            />
            <button
              onClick={() => {
                addTask(text, state);
                setText("");
                setOpen(false);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RefTest(){
  const ref = useRef();

  useEffect(() => {
    useStore.subscribe(
      (store) => store.tasks,
      (tasks) => {
        ref.current = tasks;
      }
    )
  }, []);

  return ref.current;
}