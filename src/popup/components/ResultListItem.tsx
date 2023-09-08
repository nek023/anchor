import React, { useCallback, useEffect, useMemo, useRef } from "react";
import scrollIntoView from "scroll-into-view-if-needed";
import { Item, ItemType } from "../../shared/types";
import { getFaviconUrl } from "../lib/getFaviconUrl";

interface ResultListItemProps {
  item: Item;
  selected: boolean;
  onClick?: (item: Item) => void;
}

export const ResultListItem: React.FC<ResultListItemProps> = ({
  item,
  onClick,
  selected,
}) => {
  const itemContainerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    if (onClick == null) return;
    onClick(item);
  }, [item, onClick]);

  useEffect(() => {
    if (selected && itemContainerRef?.current != null) {
      scrollIntoView(itemContainerRef?.current, {
        block: "nearest",
        inline: "nearest",
        scrollMode: "if-needed",
      });
    }
  }, [selected]);

  const faviconUrl = useMemo(() => {
    let faviconUrl: string | undefined = undefined;
    if (item.type === ItemType.Tab) faviconUrl = item.faviconUrl;
    if (faviconUrl == null && item.url != null)
      faviconUrl = getFaviconUrl(item.url);
    return faviconUrl;
  }, [item]);

  return useMemo(
    () => (
      <div
        className={`w-full min-h-[3rem] px-1 pb-px flex flex-row items-center gap-2 ${
          selected ? "bg-blue-700" : ""
        }`}
        onClick={handleClick}
        ref={itemContainerRef}
      >
        <div className="min-w-[2rem] flex justify-center">
          <img className="w-6 h-6" src={faviconUrl} alt={item.title} />
        </div>
        <div className="grow flex flex-col gap-0.5 overflow-hidden">
          <div
            className={`text-sm truncate ${
              selected ? "text-gray-100" : "text-gray-700"
            }`}
          >
            {item.title}
          </div>
          <div
            className={`text-xs font-light truncate ${
              selected ? "text-gray-300" : "text-gray-400"
            }`}
          >
            {item.url}
          </div>
        </div>
      </div>
    ),
    [faviconUrl, handleClick, item, selected],
  );
};
