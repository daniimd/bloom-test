import React from "react";
import { IconButton, Select, MenuItem } from "@mui/material";
import { ViewList, GridView } from "@mui/icons-material";
import styled from "styled-components";

interface FilterBarProps {
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  layout: string;
  title: string,
  setLayout: React.Dispatch<React.SetStateAction<string>>;
}

const FilterBar: React.FC<FilterBarProps> = ({
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
  layout,
  title,
  setLayout,
}) => {
  return (
    <FilterBarContainer>
      <h2>{title}</h2>
      <Options>
        <span>Exibir</span>
        <StyledSelect
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          size="small"
        >
          {[5, 10, 15].map((num) => (
            <StyledMenuItem key={num} value={num}>
              {num}
            </StyledMenuItem>
          ))}
        </StyledSelect>
        <p>por vez</p>
        <IconButton onClick={() => setLayout("list")}>
          <ViewList
            sx={{
              color: layout === "list" ? "#5062F0" : "#D0D3E2",
              fontSize: 30,
            }}
          />
        </IconButton>
        <IconButton onClick={() => setLayout("column")}>
          <GridView
            sx={{
              color: layout === "column" ? "#5062F0" : "#D0D3E2",
              fontSize: 30,
            }}
          />
        </IconButton>
      </Options>
    </FilterBarContainer>
  );
};

export default FilterBar;

const FilterBarContainer = styled.div`
  background-color: #f4f4f4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 10%;
  font-size: clamp(14px, 2vw, 16px);

  h2 {
    padding-right: 10px;
  }

  @media (max-width: 768px) {
    padding: 3px 4%;
  }
`;

const Options = styled.div`
  display: flex;
  align-items: center;


  @media (max-width: 768px) {
    p {
      display: none
    }
  }

`;

const StyledSelect = styled(Select)`
  .MuiSelect-select {
    padding: 6px 12px;
    font-size: 14px;
    color: #333;
  }

  .MuiOutlinedInput-notchedOutline {
    border: 0;
  }
`;

const StyledMenuItem = styled(MenuItem)``;