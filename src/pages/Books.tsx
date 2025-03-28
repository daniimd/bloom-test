import { useCallback, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import { Star as StarIcon, StarBorder as StarBorderIcon } from "@mui/icons-material";
import Header from "./../components/Header";
import Pagination from "./../components/Paginate";
import api from "./../services/api";
import { useFavorites } from './../context/FavoriteContext';
import axios from "axios";
import { BookDetails, Book, ApiResponse } from './../types/BooksDetails';
import FilterBar from "../components/FilterBar";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

export default function BookList() {
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [layout, setLayout] = useState<string>("list");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [itemsBook, setItemsBook] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const { genre } = useParams(); 
  const location = useLocation();

  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const title = location.state?.title;

  const filteredBooks = itemsBook.filter(book =>
    book.book_details[0].title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadBooks();
  }, []);

  const getBookImage = async (isbn: string): Promise<string> => {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = response.data;
      
      if (data.items && data.items[0].volumeInfo.imageLinks) {
        return data.items[0].volumeInfo.imageLinks.thumbnail;
      }
      
      return "";
    } catch (error) {
      console.error("Erro ao buscar imagem do livro:", error);
      return "";
    }
  };

  const loadBooks = useCallback(async () => {
    setLoading(true); 
    try {
      const { data: response } = await api.get<ApiResponse>(
        `lists.json?list=${genre}&api-key=${process.env.REACT_APP_API_KEY}`
      );

      const formattedList: Book[] = await Promise.all(
        response.results.map(async (book) => {
          const image = await getBookImage(book.book_details[0].primary_isbn13);
          return {
            rank: book.rank,
            amazon_product_url: book.amazon_product_url,
            book_details: book.book_details.map((detail) => ({
              ...detail,
              price: formatCurrency(detail.price),
              image,
            })),
          };
        })
      );
  
      setItemsBook(formattedList);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error('Ocorreu um erro ao carregar os dados!', {
        autoClose: 3000, 
      });
      
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFavoriteToggle = (book: BookDetails) => {
    const isFavorite = favorites.some(fav => fav.title === book.title);
    if (isFavorite) {
      removeFavorite(book.title);
    } else {
      addFavorite(book);
    }
  };

  const formatCurrency = (value: string) => {
    const number = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(number);
  };

  return (
    <>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <FilterBar
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        layout={layout}
        setLayout={setLayout}
        title={title}
      />
      
      {loading ? (
        <Loading />
      ) : (
        <>
          <Container>
            <BookContainer $layout={layout}>
              {filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((book, index) => {
                const details = book.book_details[0];
                const isFavorite = favorites.some(fav => fav.title === details.title);
                return (
                  <BookItem key={index} $layout={layout}>
                    <div>
                      <img src={details.image} alt={details.title} />
                    </div>
                    <section>
                      <div>
                        <h3>{details.title}</h3>
                        <small>
                          by {details.author}
                          <IconButton onClick={() => handleFavoriteToggle(details)}>
                            {isFavorite ? (
                              <StarIcon sx={{ color: "#5062F0", fontSize: 15 }} />
                            ) : (
                              <StarBorderIcon sx={{ color: "#5062F0", fontSize: 15 }} />
                            )}
                          </IconButton>
                        </small>
                      </div>
                      <p>{details.description}</p>
                      <p>Editora {details.publisher}</p>
                      <p>{book.rank}</p>
                      <button onClick={() => window.open(book.amazon_product_url, "_blank")}>Compre por {details.price}</button>
                    </section>
                  </BookItem>
                );
              })}
            </BookContainer>
          </Container>
          <Pagination 
            totalItems={filteredBooks.length} 
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

const BookContainer = styled.div<{ $layout: string }>`
  display: ${({ $layout }) => ($layout === "column" ? "grid" : "block")};
  grid-template-columns: ${({ $layout }) => ($layout === "column" ? "repeat(5, 1fr)" : "none")};
  gap: 20px;
  margin-top: 20px;

  h3 {
    font-weight: bold;
    font-size: clamp(14px, 2vw, 16px);
    margin-right: 3px;
    margin-bottom: ${({ $layout }) => ($layout === "column" ? "3px" : "10px")};
    display: inline-grid;
  }

  small {
    font-size: 13px;
    color: #a9a9a9;
    display: ${({ $layout }) => ($layout === "column" ? "block" : "inline")};
    margin-bottom: ${({ $layout }) => ($layout === "column" ? "10px" : "0")};
  }

  @media (max-width: 768px) {
    grid-template-columns: ${({ $layout }) =>$layout === "column" ? "repeat(2, 1fr)" : "none"};
    gap: 0;
    
    h3 {
      margin-bottom: 3px;
    }

    small {
      margin-bottom: 10px;
      display: block;
    }
  }
`;

const BookItem = styled.div<{ $layout: string }>`
  display: flex;
  flex-direction: ${({ $layout }) => ($layout === "list" ? "row" : "column")};
  align-items: ${({ $layout }) => ($layout === "list" ? "flex-start" : "flex-start")};
  gap: 10px;
  padding: 15px;
  margin: 15px 0;

  > div {
    width: 100px;
    height: 150px;
    margin: ${({ $layout }) => ($layout === "list" ? "0 24px" : "0 0 10px 0")};
    align-self: ${({ $layout }) => ($layout === "column" ? "center" : "flex-start")};
  }

  img {
    height: 150px;
  }

  button {
    background-color: #5062F0;
    color: white;
    border: none;
    padding: 10px 18px;
    cursor: pointer;
    border-radius: 100px;
    margin-top: auto;
    width: fit-content;
  }

  p {
    font-size: 14px;
    margin-bottom: 8px;
  }

  div button {
    background-color: transparent;
    padding: 0;
    top: -1px;
    margin-left: 2px;
  }

  section {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  @media (max-width: 768px) {
    gap: 0;
    padding: ${({ $layout }) => ($layout === "list" ? "15px 0" : "15px")};
    margin: ${({ $layout }) => ($layout === "list" ? "15px 0" : "0")};
  }
`;