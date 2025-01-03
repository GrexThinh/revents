import { Button, Card, Grid, Header, Tab, Image } from "semantic-ui-react";
import { Photo, Profile } from "../../types/profile";
import { useEffect, useState } from "react";
import { auth, storage } from "../../config/firebase";
import PhotoUpload from "./PhotoUpload";
import { useAppSelector } from "../../store/store";
import { useFirestore } from "../../hooks/firestore/useFirestore";
import { actions } from "./photoSlice";
import { updateProfile } from "firebase/auth";
import { deleteObject, ref } from "firebase/storage";

type Props = {
  profile: Profile;
};

export default function ProfilePhotos({ profile }: Props) {
  const [editMode, setEditMode] = useState(false);
  const isCurrentUser = auth.currentUser?.uid === profile.id;
  const { data: photos, status } = useAppSelector((state) => state.photos);
  const { loadCollection, remove } = useFirestore(
    `profiles/${auth.currentUser?.uid}/photos")`
  );
  const { update } = useFirestore("profiles");

  useEffect(() => {
    loadCollection(actions);
  }, [loadCollection]);

  async function handleSetMain(photo: Photo) {
    await update(profile.id, {
      photoURL: photo.url,
    });
    await updateProfile(auth.currentUser!, {
      photoURL: photo.url,
    });
  }

  async function handleDeletePhoto(photo: Photo) {
    try {
      const storageRef = ref(storage, `${profile.id}/user_images/${photo.id}`);
      await deleteObject(storageRef);
      await remove(photo.id);
    } catch (error: any) {
      console.error(error.message);
    }
  }

  return (
    <Tab.Pane loading={status === "loading"}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="photo" content="Photos" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editMode ? "Cancel" : "Add photo"}
              onClick={() => setEditMode(!editMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {editMode ? (
            <PhotoUpload profile={profile} setEditMode={setEditMode} />
          ) : (
            <Card.Group itemsPerRow={5}>
              {photos.map((photo) => (
                <Card key={photo.id}>
                  <Image src={photo.url} />
                  {isCurrentUser && (
                    <Button.Group>
                      <Button
                        basic
                        color="green"
                        disabled={photo.url === profile.photoURL}
                        onClick={() => handleSetMain(photo)}
                      >
                        Main
                      </Button>
                      <Button
                        basic
                        color="red"
                        icon="trash"
                        disabled={photo.url === profile.photoURL}
                        onClick={() => handleDeletePhoto(photo)}
                      />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
}
