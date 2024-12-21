import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Form, Header, Segment } from "semantic-ui-react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { categoryOptions } from "./categoryOptions";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useAppSelector } from "../../../store/store";
import { AppEvent } from "../../../types/event";
import { Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { useFirestore } from "../../../hooks/firestore/useFirestore";
import { useEffect } from "react";
import { actions } from "../eventSlice";
import LoadingComponent from "../../../layout/LoadingComponent";

export default function EventForm() {
  const { loadDocument, create, update } = useFirestore("events");
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onTouched",
    defaultValues: async () => {
      if (event)
        return {
          ...event,
          date: new Date(event.date),
        };
    },
  });
  const { id } = useParams();
  const event = useAppSelector((state) =>
    state.events.data.find((e) => e.id === id)
  );
  const { status } = useAppSelector((state) => state.events);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    loadDocument(id, actions);
  }, [id, loadDocument]);

  async function updateEvent(data: AppEvent) {
    if (!event) return;
    await update(data.id, {
      ...data,
      date: Timestamp.fromDate(data.date as unknown as Date),
    });
  }

  async function createEvent(data: AppEvent) {
    const ref = await create({
      ...data,
      hostedBy: "bob",
      attendees: [],
      hostPhotoURL: "",
      date: Timestamp.fromDate(data.date as unknown as Date),
    });
    return ref;
  }

  async function handleCancelToggle(event: AppEvent) {
    await update(event.id, { isCancelled: !event.isCancelled });
    toast.success(
      `Event has been ${event.isCancelled ? "uncancelled" : "cancelled"}`
    );
  }

  async function onSubmit(data: FieldValues) {
    try {
      if (event) {
        await updateEvent({ ...event, ...data });
        navigate(`/events/${event.id}`);
      } else {
        const ref = await createEvent(data as AppEvent);
        navigate(`/events/${ref?.id}`);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  }

  if (status === "loading") return <LoadingComponent />;

  return (
    <Segment clearing>
      <Header content="Event details" sub color="teal" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Input
          placeholder="Event title"
          defaultValue={event?.title || ""}
          {...register("title", { required: true })}
          error={errors.title && "Title is required"}
        />
        <Controller
          name="category"
          control={control}
          rules={{ required: "Category is required" }}
          defaultValue={event?.category}
          render={({ field }) => (
            <Form.Select
              options={categoryOptions}
              placeholder="Category"
              clearable
              {...field}
              onChange={(_, d) =>
                setValue("category", d.value, { shouldValidate: true })
              }
              error={errors.category && errors.category.message}
            />
          )}
        />

        <Form.TextArea
          placeholder="Description"
          defaultValue={event?.description || ""}
          {...register("description", { required: "Description is required" })}
          error={errors.description && errors.description.message}
        />
        <Header sub content="Location details" color="teal" />
        <Form.Input
          placeholder="City"
          defaultValue={event?.city || ""}
          {...register("city", { required: "City is required" })}
          error={errors.city && errors.city.message}
        />
        <Form.Input
          placeholder="Venue"
          defaultValue={event?.venue || ""}
          {...register("venue", { required: "Venue is required" })}
          error={errors.venue && errors.venue.message}
        />
        <Form.Field>
          <Controller
            name="date"
            control={control}
            rules={{ required: "Date is required" }}
            defaultValue={(event && new Date(event.date)) || null}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(value) =>
                  setValue("date", value, { shouldValidate: true })
                }
                showTimeSelect
                timeCaption="time"
                dateFormat="MMM d, yyyy h:mm aa"
                placeholderText="Event date and time"
              />
            )}
          />
        </Form.Field>
        {event && (
          <Button
            type="button"
            floated="left"
            color={event.isCancelled ? "green" : "red"}
            content={event.isCancelled ? "Reactivate event" : "Cancel event"}
            onClick={() => handleCancelToggle(event)}
          />
        )}
        <Button
          loading={isSubmitting}
          disabled={!isValid}
          type="submit"
          floated="right"
          positive
          content="Submit"
        />
        <Button
          disabled={isSubmitting}
          as={Link}
          to="/events"
          type="button"
          floated="right"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
}
