import axios from "axios";
import type { AxiosResponse } from "axios"
import type { Note, Tag } from "../types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api/",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  }
});

export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/notes/${id}`);
};

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  total: number;
  page: number;
  pageCount: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: Tag;
}

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> =
    await api.get("/notes", { params });

  return response.data;
};

export const createNote = async (
  payload: CreateNotePayload
): Promise<Note> => {
  const response: AxiosResponse<Note> =
    await api.post("/notes", payload);

  return response.data;
};
