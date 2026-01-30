import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";

import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import css from "./App.module.css";

const PER_PAGE = 12;

function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => setPage(1), [debouncedSearch]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      }),
    placeholderData: (prev) => prev,
  });

const createMutation = useMutation({
  mutationFn: createNote,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  },
});

const deleteMutation = useMutation({
  mutationFn: deleteNote,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  },
});

  const handleCreateNote = async (values: any) => {
    await createMutation.mutateAsync(values);
    setIsModalOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading notes</p>;
  if (!data) return null;
  
const pageCount = 12;

  
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

        {pageCount > 1 && (
          <Pagination
            pageCount={pageCount}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main className={css.content}>
        <NoteList notes={data.notes} onDelete={handleDeleteNote} />
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
