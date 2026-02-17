import React from "react";
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
  return (
    <div className="w-full flex flex-col grow overflow-y-auto">
      {items.map((item, index) => (
        <ResultListItem
          key={item.id}
          item={item}
          index={index}
          selected={index === selectedItemIndex}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
};
