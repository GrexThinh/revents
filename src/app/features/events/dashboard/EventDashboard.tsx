import { Grid } from "semantic-ui-react";
import EventList from "./EventList";
import { useAppSelector } from "../../../store/store";
import { useEffect, useRef, useState } from "react";
import { actions } from "../eventSlice";
import { useFirestore } from "../../../hooks/firestore/useFirestore";
import EventFilters from "./EventFilters";
import { QueryOption } from "../../../hooks/firestore/types";
import EventListItemPlaceholder from "./EventListItemPlaceholder";

export default function EventDashboard() {
  const contextRef = useRef(null);
  const { data: events, status } = useAppSelector((state) => state.events);
  const { loadCollection } = useFirestore("events");
  const [query, setQuery] = useState<QueryOption[]>([
    { attribute: "date", operator: ">=", value: new Date() },
  ]);

  useEffect(() => {
    loadCollection(actions, {
      queries: query,
    });
  }, [loadCollection, query]);

  return (
    <Grid>
      <Grid.Column width={10} ref={contextRef}>
        {status === "loading" ? (
          <>
            <EventListItemPlaceholder />
            <EventListItemPlaceholder />
          </>
        ) : (
          <EventList events={events} />
        )}
      </Grid.Column>
      <Grid.Column width={6}>
        <div className="ui fixed top sticky" style={{ top: 98, width: 405 }}>
          <EventFilters setQuery={setQuery} />
        </div>
      </Grid.Column>
    </Grid>
  );
}
