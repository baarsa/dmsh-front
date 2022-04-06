import { createCn } from "../../utils";
import ReactPaginate from "react-paginate";
import "./Paginate.css";

const cn = createCn("paginate");

type Props = {
  currentPage: number;
  onPageChange: (value: number) => void;
  pageCount: number;
};

export const Paginate = ({ currentPage, onPageChange, pageCount }: Props) => (
  <ReactPaginate
    className={cn()}
    pageCount={pageCount}
    forcePage={currentPage}
    onPageChange={({ selected }) => onPageChange(selected)}
    previousLabel="<"
    nextLabel=">"
    pageClassName={cn("page-item")}
    pageLinkClassName={cn("page-link")}
    previousClassName={cn("page-item")}
    previousLinkClassName={cn("page-link")}
    nextClassName={cn("page-item")}
    nextLinkClassName={cn("page-link")}
    breakClassName={cn("page-item")}
    breakLinkClassName={cn("page-link")}
    containerClassName={cn("pagination")}
    activeClassName={cn("active")}
  />
);
