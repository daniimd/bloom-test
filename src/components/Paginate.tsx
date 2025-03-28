import React, { useEffect } from "react";
import styled from "styled-components";

interface PaginateProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Paginate: React.FC<PaginateProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxVisiblePages = 6; 

  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentPage(1);
  }, [totalItems, setCurrentPage]);

  const getVisiblePages = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <Container>
      <PageButton disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
        {"<"}
      </PageButton>
      {getVisiblePages().map((page) => (
        <PageNumber 
          key={page} 
          $active={page === currentPage}
          onClick={() => {
            setCurrentPage(page);
            window.scrollTo(0, 0);
          }}
        >
          {page}
        </PageNumber>
      ))}
      <PageButton disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
        {">"}
      </PageButton>
    </Container>
  );
};

export default Paginate;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 3%;
`;

const PageButton = styled.button`
  border: none;
  background: #fff;
  cursor: pointer;
  border-radius: 35%;
  width: 33px;
  height: 33px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1.5px solid #1f2445;
`;

interface PageNumberProps {
  active: boolean;
}

const PageNumber = styled.button<{ $active: boolean }>`
  border: none;
  cursor: pointer;
  border-radius: 35%;
  background: ${({ $active }) => ($active ? "#1F2445" : "#fff")};
  color: ${({ $active }) => ($active ? "white" : "black")};
  width: 33px;
  height: 33px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  border: 1.5px solid #1f2445;
`;