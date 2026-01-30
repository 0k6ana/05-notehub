import { useState, useEffect } from "react";
import { useQuery} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import {fetchNotes} from "../../services/noteService";

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

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Error loading notes</p>;

  const pageCount = data.pageCount;

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
        {data.notes.length > 0 && (
          <NoteList
            notes={data.notes}
          />
        )}
      </main>

  {isModalOpen && (
  <Modal onClose={() => setIsModalOpen(false)}>
    <NoteForm
      onCancel={() => setIsModalOpen(false)}
    />
  </Modal>
)}
    </div>
  );
}

export default App;
