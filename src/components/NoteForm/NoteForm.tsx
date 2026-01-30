import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import type { Tag } from "../../types/note";

interface FormValues {
  title: string;
  content: string;
  tag: Tag;
}

interface NoteFormProps {
  onCancel: () => void;
}

const schema = Yup.object({
  title: Yup.string().min(3).max(50).required(),
  content: Yup.string().max(500),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required(),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn:createNote,
        onSuccess: () =>{
            queryClient.invalidateQueries({queryKey: ["notes"]});
            onCancel()
        }
    })
  return (
    <Formik<FormValues>
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={schema}
      onSubmit={(value)=> mutation.mutate(value)}
    >
      <Form>
        <div>
          <label htmlFor="title">Title</label>
          <Field id="title" name="title" />
          <ErrorMessage name="title" component="span" />
        </div>

        <div>
          <label htmlFor="content">Content</label>
          <Field as="textarea" id="content" name="content" rows={8} />
          <ErrorMessage name="content" component="span" />
        </div>

        <div>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag">
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" />
        </div>

        <div>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit">Create note</button>
        </div>
      </Form>
    </Formik>
  );
}
