import classNames from "classnames";
import { useEffect, useState } from "react";

const getPagesCut = ({ totalPages, currentPage, pagesCutCount = 5 }) => {
  const ceiling = Math.ceil(pagesCutCount / 2);
  const floor = Math.floor(pagesCutCount / 2);

  if (totalPages < pagesCutCount) {
    return { start: 1, end: totalPages + 1 };
  } else if (currentPage >= 1 && currentPage <= ceiling) {
    return { start: 1, end: pagesCutCount + 1 };
  } else if (currentPage + floor >= totalPages) {
    return { start: totalPages - pagesCutCount + 1, end: totalPages + 1 };
  } else {
    return { start: currentPage - ceiling + 1, end: currentPage + floor + 1 };
  }
};

const Pagination = ({ totalPages, currentPage, changePage, pagesCutCount = 5, pageLinks, pageTopLinks }) => {
  const [pagesCut, setPagesCut] = useState({});
  const [pages, setPages] = useState([]);

  useEffect(() => {
    setPagesCut(getPagesCut({ totalPages, currentPage, pagesCutCount }));
  }, [currentPage, pagesCutCount, totalPages]);

  useEffect(() => {
    if (pagesCut.end && pagesCut.start) {
      setPages([...Array(pagesCut.end - pagesCut.start).keys()].map((el) => el + pagesCut.start));
    }
  }, [pagesCut.end, pagesCut.start]);

  return (
    <div className="pagination center">
      <ul className="pagination-list">
        {pageTopLinks && (
          <li>
            <button onClick={() => 1 !== currentPage && changePage(1)} type="button">
              <i className="lni lni-angle-double-left" />
            </button>
          </li>
        )}
        {pageLinks && (
          <li>
            <button onClick={() => 1 !== currentPage && changePage(currentPage - 1)} type="button">
              <i className="lni lni-chevron-left" />
            </button>
          </li>
        )}
        {pages?.map((page, index) => (
          <li
            key={index}
            className={classNames({
              // "page-item": true,
              active: page === currentPage,
              //   disabled: isDisabled,
            })}
          >
            <button onClick={() => changePage(page)} type="button">
              {page}
            </button>
          </li>
        ))}
        {pageLinks && (
          <li>
            <button onClick={() => totalPages !== currentPage && changePage(currentPage + 1)} type="button">
              <i className="lni lni-chevron-right" />
            </button>
          </li>
        )}
        {pageTopLinks && (
          <li>
            <button onClick={() => totalPages !== currentPage && changePage(totalPages)} type="button">
              <i className="lni lni-angle-double-right" />
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};
export default Pagination;
