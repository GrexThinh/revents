import { createGenericSlice, GenericState } from "../../store/genericSlice";
import { Photo } from "../../types/profile";

type State = {
  data: Photo[];
};

const initialState: State = {
  data: [],
};

export const photoSlice = createGenericSlice({
  name: "photos",
  initialState: initialState as GenericState<Photo[]>,
  reducers: {},
});

export const actions = photoSlice.actions;
