import React, { useCallback } from "react";
import styled from "styled-components";
import { Item } from "../../lib/types";
import { ResultListItem } from "./ResultListItem";

const Container = styled.ul`
  width: 100%;
  height: 432px; /* (46 + 2) * 9 */
  padding: 0;
  margin: 8px 0 0;
  display: block;
  list-style: none;
  overflow-x: hidden;
  overflow-y: auto;
  white-space: nowrap;
  cursor: default;
`;

interface ResultListProps {
  items: Item[];
  selectedItemIndex: number;
  onItemClick?: (index: number) => void;
}

export const ResultList: React.VFC<ResultListProps> = ({
  items,
  onItemClick,
  selectedItemIndex,
}) => {
  const handleClick = useCallback(
    (item: Item) => {
      if (onItemClick == null) return;
      const index = items.findIndex((i) => i.id === item.id);
      onItemClick(index);
    },
    [items, onItemClick]
  );

  return (
    <Container>
      {items.map((item, index) => (
        <ResultListItem
          key={index}
          item={item}
          selected={index === selectedItemIndex}
          onClick={handleClick}
        />
      ))}
    </Container>
  );
};
