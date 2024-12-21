import { Grid } from "semantic-ui-react";
import EventList from "./EventList";
import { useAppSelector } from "../../../store/store";
import { useEffect } from "react";
import LoadingComponent from "../../../layout/LoadingComponent";
import { actions } from "../eventSlice";
import { useFirestore } from "../../../hooks/firestore/useFirestore";

export default function EventDashboard() {
  const { data: events, status } = useAppSelector((state) => state.events);
  const { loadCollection } = useFirestore("events");

  useEffect(() => {
    loadCollection(actions);
  }, [loadCollection]);

  if (status === "loading") return <LoadingComponent />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventList events={events} />
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>Filters</h2>
      </Grid.Column>
    </Grid>
  );
}
