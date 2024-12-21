import { PayloadAction } from "@reduxjs/toolkit";
import { AppEvent } from "../../types/event";
import { Timestamp } from "firebase/firestore";
import {
  createGenericSlice,
  GenericActions,
  GenericState,
} from "../../store/genericSlice";

type State = {
  data: AppEvent[];
};

const initialState: State = {
  data: [],
};

export const eventSlice = createGenericSlice({
  name: "events",
  initialState: initialState as GenericState<AppEvent[]>,
  reducers: {
    success: {
      reducer: (state, action: PayloadAction<AppEvent[]>) => {
        state.data = action.payload;
        state.status = "finished";
      },
      prepare: (events: AppEvent[]) => {
        let eventArray: AppEvent[] = [];
        Array.isArray(events) ? (eventArray = events) : eventArray.push(events);
        const mapped = eventArray.map((e: any) => {
          return { ...e, date: (e.date as Timestamp).toDate().toISOString() };
        });
        return { payload: mapped };
      },
    },
  },
});

export const actions = eventSlice.actions as GenericActions<AppEvent[]>;
