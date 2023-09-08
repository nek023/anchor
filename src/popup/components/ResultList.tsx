import React, { useCallback } from "react";
import { Item } from "../../shared/types";
import { ResultListItem } from "./ResultListItem";

interface ResultListProps {
  items: Item[];
  selectedItemIndex: number;
  onItemClick?: (index: number) => void;
}

export const ResultList: React.FC<ResultListProps> = ({
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
    [items, onItemClick],
  );

  return (
    <div className="w-full flex flex-col grow overflow-y-auto">
      {items.map((item, index) => (
        <ResultListItem
          key={index}
          item={item}
          selected={index === selectedItemIndex}
          onClick={handleClick}
        />
      ))}
    </div>
  );
};
