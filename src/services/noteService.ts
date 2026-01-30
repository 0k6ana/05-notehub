import axios from "axios";
import type { AxiosResponse } from "axios"
import type { Note, Tag } from "../types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api/",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  }
});

export const deleteNote = async (id: string): Promise<Note> => {
  const {data} = await api.delete<Note>(`/notes/${id}`)
  return data;
};

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string | null;
  tag: Tag;
}


export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>("/notes", { params });
  return response.data;
};


export const createNote = async (
  payload: CreateNotePayload
): Promise<Note> => {
  const response: AxiosResponse<Note> =
    await api.post("/notes", payload);

  return response.data;
};
