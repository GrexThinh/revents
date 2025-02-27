import { PayloadAction } from "@reduxjs/toolkit";
import { AppEvent } from "../../types/event";
import { Timestamp } from "firebase/firestore";
import {
  createGenericSlice,
  GenericActions,
  GenericState,
} from "../../store/genericSlice";
import { auth } from "../../config/firebase";

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
          return {
            ...e,
            date: (e.date as Timestamp).toDate().toISOString(),
            isHost: auth.currentUser?.uid === e.hostUid,
            isGoing: e.attendeeIds?.includes(auth.currentUser?.uid),
          };
        });
        return { payload: mapped };
      },
    },
  },
});

export const actions = eventSlice.actions as GenericActions<AppEvent[]>;
