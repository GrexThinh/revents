import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import { useFirestore } from "../../hooks/firestore/useFirestore";
import { useEffect } from "react";
import { actions } from "./profileSlice";
import LoadingComponent from "../../layout/LoadingComponent";

export default function ProfilePage() {
  const { id } = useParams();
  const { status, data } = useAppSelector((state) => state.profiles);
  const profile = data.find((profile) => profile.id === id);
  const { loadDocument } = useFirestore("profiles");

  useEffect(() => {
    if (id) {
      loadDocument(id, actions);
    }
  }, [id, loadDocument]);

  if (status === "loading")
    return <LoadingComponent content="Loading profile..." />;

  if (!profile) return <h2>Profile not found</h2>;

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile} />
        <ProfileContent profile={profile} />
      </Grid.Column>
    </Grid>
  );
}
