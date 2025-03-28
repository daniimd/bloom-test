import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "./../components/Header";
import Pagination from "./../components/Paginate";
import api from "./../services/api";
import FilterBar from "../components/FilterBar";
import Loading from "../components/Loading";
import { toast } from 'react-toastify';

interface GenreApi {
  display_name: string;
  newest_published_date: string;
  oldest_published_date: string;
  list_name_encoded: string;
  updated: string;
}

export default function GenreList() {
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [layout, setLayout] = useState<string>("list");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [itemsGenre, setItemsGenre] = useState<GenreApi[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const filteredGenres = itemsGenre.filter(genre =>
    genre.display_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = useCallback(async () => {
    setLoading(true); 
    try {
      const { data: response } = await api.get(
        `lists/names.json?api-key=${process.env.REACT_APP_API_KEY}`
      );

      const formattedList = response.results.map((genre: GenreApi) => ({
        display_name: genre.display_name,
        newest_published_date: formattedDatePtBR(genre.newest_published_date),
        oldest_published_date: formattedDatePtBR(genre.oldest_published_date),
        list_name_encoded: genre.list_name_encoded,
        updated: genre.updated,
      }));

      setItemsGenre(formattedList);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error('Ocorreu um erro ao carregar os dados!', {
        autoClose: 3000, 
      });
    } finally {
      setLoading(false);
    }
  }, []);

  function formattedDatePtBR(date: String) {
    const data = new Date(date + "T00:00:00");
    const formattedDate = data.toLocaleDateString("pt-BR");

    return formattedDate;
  }

  const handleNavigation = (listNameEncoded: string, displayName: string) => {
    navigate(`/books/${listNameEncoded}`, {
      state: { title: displayName },
    });
  };

  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FilterBar
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        layout={layout}
        setLayout={setLayout}
        title={"Gêneros"}
      />

      {loading ? (
        <Loading />
      ) : (
        <>
          <Container>
            <GenreContainer layout={layout}>
              {filteredGenres
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((genre, index) => (
                  <GenreItem key={index} layout={layout}>
                    <div>
                      <button onClick={() => handleNavigation(genre.list_name_encoded, genre.display_name)}>
                        {genre.display_name}
                      </button>
                      <small>{genre.updated}</small>
                    </div>
                    <span>Última publicação: {genre.newest_published_date}</span>
                    <span>Publicação mais antiga: {genre.oldest_published_date}</span>
                  </GenreItem>
                ))}
            </GenreContainer>
          </Container>
          <Pagination
            totalItems={filteredGenres.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </>
  );
}

const Container = styled.div`
  font-family: Arial, sans-serif;
  padding: 12px 10%;
  @media (max-width: 768px) {
    padding: 12px 4%;
  }
`;

const GenreContainer = styled.div<{ layout: string }>`
  border-radius: 8px;
  display: ${({ layout }) => (layout === "column" ? "grid" : "block")};
  grid-template-columns: ${({ layout }) => layout === "column" ? "repeat(5, 1fr)" : "none"};
  gap: ${({ layout }) => (layout === "column" ? "16px" : "0")};

  @media (max-width: 768px) {
    grid-template-columns: ${({ layout }) => layout === "column" ? "repeat(2, 1fr)" : "none"};
    gap: 1;
  }
`; 

const GenreItem = styled.div<{ layout: string }>`
  display: grid;
  grid-template-columns: ${({ layout }) => layout === "list" ? "1fr auto auto" : "none"};
  gap: ${({ layout }) => layout === "list" ? "16px 32px" : "0"};
  padding: 12px 0;

  button {
    color: #3f51b5;
    text-decoration: none;
    font-weight: bold;
    border: 0;
    background-color: transparent;
    text-align: left;
    text-decoration: underline;
    font-size: clamp(14px, 2vw, 18px);
    margin-right: 3px;
    display: inline-grid;
    min-height: ${({ layout }) => (layout === "column" ? "40px" : "0")};;
  }

  small {
    font-size: 11px;
    color: darkgray;
    display: ${({ layout }) => (layout === "column" ? "block" : "inline")};
  }

  span {
    font-size: 12px;
    color: #1e1e1e;
    text-align: ${({ layout }) => layout === "list" ? "right" : "left"};
  }

  div {
    margin-bottom: ${({ layout }) => layout === "column" ? "3%" : "0"};
  }

  @media (max-width: 768px) {
    grid-template-columns: none;
    gap: 0;

    span {
      text-align: left;
    }

    small {
      display: block;
      margin-bottom: 5px;
    }
  }
`;