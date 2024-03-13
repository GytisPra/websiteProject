// TODO: The timer doesn't start until the table is expanded
//       it should be counting regardless if the page is open or not
//       maybe this can be done when we are saving the jobs in a database

import { useState, useEffect } from "react";
import WorkCard from "./WorkCard";
import ExpandedTableHeader from "./ExpandedTableHeader";

interface WorkCard {
  orderedBy: string;
  workName: string;
  workStatus: string;
  completionDate: Date;
}

interface ExpandedTable {
  expanded: boolean;
  workCards: WorkCard[];
  searchQuery: string;
}

export default function ExpandedTable({
  expanded,
  workCards,
  searchQuery,
}: ExpandedTable) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const cardsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSort = (column: string) => {
    setSortColumn(column);
    setSortOrder(sortColumn === column && sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredWorkCards = workCards.filter((work) =>
    work.workName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedWorkCards = [...filteredWorkCards].sort((a, b) => {
    const order = sortOrder === "asc" ? 1 : -1;
    switch (sortColumn) {
      case "orderedBy":
        return order * a.orderedBy.localeCompare(b.orderedBy);
      case "name":
        return order * a.workName.localeCompare(b.workName);
      case "status":
        return order * a.workStatus.localeCompare(b.workStatus);
      case "endDate":
        return (
          order * (a.completionDate.getTime() - b.completionDate.getTime())
        );
      default:
        return 0;
    }
  });

  const maxPageAmount = Math.ceil(filteredWorkCards.length / cardsPerPage);
  const currentCards = sortedWorkCards.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage,
  );

  return (
    <div className={`${!expanded && "hidden"} w-full`}>
      {filteredWorkCards.length > 0 ? (
        <>
          <table
            className={`expanded-content-table mt-4 outline outline-1 outline-gray-100 w-full`}
          >
            <ExpandedTableHeader
              handleSort={handleSort}
              sortOrder={sortOrder}
              sortColumn={sortColumn}
            />
            <tbody>
              {currentCards.map((work, index) => (
                <WorkCard
                  key={index}
                  orderedBy={work.orderedBy}
                  workName={work.workName}
                  workStatus={work.workStatus}
                  completionDate={work.completionDate}
                />
              ))}
            </tbody>
          </table>
          {maxPageAmount > 1 && (
            <div className="page-buttons flex justify-center mt-2">
              <ul className="flex list-none">
                {Array.from({ length: maxPageAmount }).map((_, index) => (
                  <li key={index} className="mx-1">
                    <button
                      className={`w-10 h-8 rounded ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <span>No Results Found</span>
      )}
    </div>
  );
}
