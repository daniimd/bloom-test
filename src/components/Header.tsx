import React, { useState } from "react";
import styled from "styled-components";
import { IconButton, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Search, Star } from "@mui/icons-material";
import { useFavorites } from './../context/FavoriteContext';
import StarIcon from "@mui/icons-material/Star";
import { BookDetails } from './../types/BooksDetails';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  
  const [openModal, setOpenModal] = useState(false);

  const handleModalToggle = () => {
    setOpenModal(!openModal);
  };

  const handleFavoriteToggle = (book: BookDetails) => {
    const isFavorite = favorites.some(fav => fav.title === book.title);
    if (isFavorite) {
      removeFavorite(book.title);
    } else {
      addFavorite(book); 
    }
  };

  return (
    <>
      <Container>
        <TopBar>
          <Title>
            <a href="/">Bloom Books</a>
          </Title>
          <IconButton onClick={handleModalToggle}>
            <Star sx={{ color: "#fff" }} />
          </IconButton>
        </TopBar>
        <SearchContainer>
          <Icon>
            <Search />
          </Icon>
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquise aqui..."
          />
        </SearchContainer>
      </Container>

      <CustomDialog open={openModal} onClose={handleModalToggle}>
        <DialogTitle>Favoritos</DialogTitle>
        <DialogContent>
          {favorites.length === 0 ? (
            <p>Você ainda não tem livros favoritos.</p>
          ) : (
            <FavoritesContainer>
              {favorites.map((book) => {
                return (
                  <FavoriteItem key={book.title}>
                  <img src={book.image} alt={book.title} />
                  <div>
                    <span>{book.title}</span>
                    <small>
                      by {book.author}
                      <IconButton onClick={() => handleFavoriteToggle(book)}>
                          <StarIcon sx={{ color: "#5062F0", fontSize: 15 }} />
                      </IconButton>
                    </small>
                  </div>
                </FavoriteItem>
                );
              })}
            </FavoritesContainer>
          )}
        </DialogContent>
      </CustomDialog>
    </>
  );
};

export default Header;

const Container = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #5062f0;
  color: white;
  padding: 12px 10%;

  @media (max-width: 768px) {
    padding: 5px 4% 12px 4%;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 20px;
  cursor: pointer;

  a {
    color: #fff;
    text-decoration: none;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 100px;
  padding: 3px;
  max-width: 400px;
  width: 100%;

  @media (min-width: 768px) {
    position: absolute;
  }
`;

const Icon = styled.span`
  font-size: 20px;
  color: #5062f0;
  margin: 0 8px;
  margin-top: 3px;
`;

const Input = styled.input`
  width: 100%;
  font-size: inherit;
  border: none;
  outline: none;
  ::placeholder {
    color: inherit;
  }
`;

const CustomDialog = styled(Dialog)`
  & .MuiDialog-paper {
    margin: 0;
    width: 90%;  
    height: auto;
    position: absolute;  
    right: 11%; 
    top: 60px;
    margin-top: 20px;
    @media (max-width: 768px) {
      right: 0; 
      top: 30px;
    }
  }
`;

const FavoritesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FavoriteItem = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;

  div {
    display: flex;
    flex-direction: column;
  }

  img {
    width: 55px;
    height: 85px;
    margin-right: 10px;
  }

  span {
    font-weight: bold;
    font-size: clamp(14px, 2vw, 16px);
    color: #333;
  }

  small {
    font-size: 13px;
    color: #6a6a6a;
    display: flex;
    align-items: center;
  }

  button {
    padding-left: 3px
  }
`;

const NoFavoritesMessage = styled.p`
  color: #5062f0;
`;