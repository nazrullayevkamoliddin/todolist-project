import { render } from "@testing-library/react";
import { useStore } from "./store";
import { useEffect } from "react";
import { vi } from "vitest";

vi.mock('zustand')

function TestComponent({ selector, effect }) {
  const items = useStore(selector);

  useEffect(() => {
    effect(items), [items];
  });

  return null;
}

test("should return default value at the start", () => {
  const selector = (store) => store.tasks;
  const effect = vi.fn();
  render(<TestComponent selector={selector} effect={effect} />);
  expect(effect).toHaveBeenNthCalledWith([]);
});

test("should add an items to the store and return the effect", () => {
  const selector = (store) => ({ tasks: store.tasks, addTask: store.addTask });
  const effect = vi.fn().mockImplementation((items) => {
    if (items.tasks.length === 0) {
      items.addTask("a", "b");
    }
  });
  render(<TestComponent selector={selector} effect={effect} />);
  expect(effect).toHaveBeenCalledTimes(2);
  expect(effect).toHaveBeenNthCalledWith(
    expect.objectContaining({ tasks: [{ title: "a", state: "b" }] })
  );
});

test("should add an items to the store and return the effect", () => {
  const selector = (store) => ({
    tasks: store.tasks,
    addTask: store.addTask,
    deleteTask: store.deleteTask,
  });
  let createdTask = false;
  let curretItems
  const effect = vi.fn().mockImplementation((items) => {
    curretItems = items;
    if (!createdTask) {
      items.addTask("a", "b");
      createdTask = true;
    } else {
      items.deleteTask("a");
    }
  });
  render(<TestComponent selector={selector} effect={effect} />);
  expect(effect).toHaveBeenCalledTimes(3);
  expect(curretItems).toEqual([])
});
