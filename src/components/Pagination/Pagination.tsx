import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface Props {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pageCount, currentPage, onPageChange }: Props) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1} 
      onPageChange={(selectedItem) => onPageChange(selectedItem.selected + 1)}
      previousLabel="<"
      nextLabel=">"
      containerClassName={css.pagination}
      pageClassName={css.page}
      activeClassName={css.active}
    />
  );
}
