'use client'

import { createContext, useContext, useReducer } from "react";
import { Task } from "@/schema/taskSchema";

interface PlatformContextIntf {
  tasks: Task[];
}

type ACTION =
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string };

const initialState: PlatformContextIntf = {
  tasks: [],
};

export const PlatFormContext = createContext<{
  state: PlatformContextIntf;
  dispatch: React.Dispatch<ACTION>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const reducer = (
  state: PlatformContextIntf,
  action: ACTION
): PlatformContextIntf => {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
      };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
  }
};

export const PlatformContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <PlatFormContext.Provider value={{ dispatch, state }}>
      {children}
    </PlatFormContext.Provider>
  );
};

export function usePlatform() {
  const context = useContext(PlatFormContext);
  if (!context) {
    throw new Error(
      "usePlatform must be used within a PlatformContextProvider"
    );
  }
  return context;
}
