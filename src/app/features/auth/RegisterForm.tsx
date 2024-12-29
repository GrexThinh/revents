import ModalWrapper from "../../common/modals/ModalWrapper";
import { FieldValues, useForm } from "react-hook-form";
import { useAppDispatch } from "../../store/store";
import { closeModal } from "../../common/modals/modalSlice";
import { Button, Form, Label } from "semantic-ui-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useFirestore } from "../../hooks/firestore/useFirestore";
import { Timestamp } from "firebase/firestore";

export default function RegisterForm() {
  const { set } = useFirestore("profiles");
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, isValid, isDirty, errors },
  } = useForm({ mode: "onTouched" });
  const dispatch = useAppDispatch();

  async function onSubmit(data: FieldValues) {
    try {
      const userCreds = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(userCreds.user, {
        displayName: data.displayName,
      });
      await set(userCreds.user.uid, {
        displayName: data.displayName,
        email: data.email,
        createdAt: Timestamp.now(),
      });
      dispatch(closeModal());
    } catch (error: any) {
      setError("root.serverError", {
        type: "400",
        message: error.message,
      });
    }
  }
  return (
    <ModalWrapper header="Register to re-vents">
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Input
          defaultValue=""
          placeholder="Display name"
          {...register("displayName", { required: true })}
          error={errors.displayName && "DisplayName is required"}
        />
        <Form.Input
          defaultValue=""
          placeholder="Email address"
          {...register("email", {
            required: true,
            pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
          })}
          error={
            (errors.email?.type === "required" && "Email is required") ||
            (errors.email?.type === "pattern" && "Email is invalid")
          }
        />
        <Form.Input
          type="password"
          defaultValue=""
          placeholder="Password"
          {...register("password", { required: true })}
          error={errors.password && "Password is required"}
        />
        {errors.root && (
          <Label
            basic
            color="red"
            style={{ display: "block", marginBottom: 10 }}
            content={errors.root.serverError.message}
          />
        )}
        <Button
          loading={isSubmitting}
          disabled={!isValid || !isDirty || isSubmitting}
          type="submit"
          fluid
          size="large"
          color="teal"
          content="Register"
        />
      </Form>
    </ModalWrapper>
  );
}
