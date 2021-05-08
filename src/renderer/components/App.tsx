import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useThrottle } from "react-use";
import { ResultList } from "./ResultList";
import { SearchBar } from "./SearchBar";
import { KeyboardEventHandler } from "./KeyboardEventHandler";
import { Item } from "../../common/types";
import { closeWindow } from "../lib/closeWindow";
import { openItem } from "../lib/openItem";
import { useRemoteQuery } from "../lib/useRemoteQuery";
import { useQueryResults } from "../lib/useQueryResults";

const Container = styled.div`
  padding: 8px;
`;

const initialQuery = new URL(document.URL).searchParams.get("q") || "";

export const App: React.FC = () => {
  const [query, setQuery] = useState(initialQuery);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  useRemoteQuery(useCallback((query) => setQuery(query), []));

  useQueryResults(
    useThrottle(query, 50),
    useCallback((items) => setItems(items.slice(0, 100)), [])
  );

  const handleEnter = useCallback(() => {
    if (items.length === 0) return;
    openItem(items[selectedItemIndex]);
    closeWindow();
  }, [items, selectedItemIndex]);

  const handleUp = useCallback(() => {
    if (selectedItemIndex <= 0) return;
    setSelectedItemIndex(selectedItemIndex - 1);
  }, [selectedItemIndex]);

  const handleDown = useCallback(() => {
    if (selectedItemIndex >= items.length - 1) return;
    setSelectedItemIndex(selectedItemIndex + 1);
  }, [items.length, selectedItemIndex]);

  const handleItemClick = useCallback(
    (index: number) => {
      setSelectedItemIndex(index);
      openItem(items[index]);
      closeWindow();
    },
    [items]
  );

  const handleValueChange = useCallback((query: string) => setQuery(query), [
    setQuery,
  ]);

  return (
    <KeyboardEventHandler
      onEnter={handleEnter}
      onEscape={closeWindow}
      onUp={handleUp}
      onDown={handleDown}
    >
      <Container>
        <SearchBar value={query} onValueChange={handleValueChange} />
        <ResultList
          items={items}
          onItemClick={handleItemClick}
          selectedItemIndex={selectedItemIndex}
        />
      </Container>
    </KeyboardEventHandler>
  );
};
