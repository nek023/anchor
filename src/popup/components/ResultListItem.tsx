import React, { useCallback, useEffect, useMemo, useRef } from "react";
import scrollIntoView from "scroll-into-view-if-needed";
import styled, { css } from "styled-components";
import { Item, ItemType } from "../../lib/types";

const ItemLeft = styled.div`
  width: 30px;
  min-width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemRight = styled.div`
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
`;

const ItemImage = styled.img`
  width: 24px;
  height: 24px;
`;

const ItemTitle = styled.div`
  color: #333333;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const ItemUrl = styled.div`
  color: #9999aa;
  margin-top: 2px;
  font-size: 13px;
  font-weight: lighter;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const ItemContainer = styled.li<{ selected: boolean }>`
  width: 100%;
  height: 46px;
  padding: 3px;
  margin-bottom: 2px;
  overflow: hidden;
  display: flex;
  flex-direction: row;

  ${(props) =>
    props.selected &&
    css`
      background-color: #0067ff;

      ${ItemTitle} {
        color: #fafafa;
      }

      ${ItemUrl} {
        color: #bcd5fb;
      }
    `}
`;

interface ResultListItemProps {
  item: Item;
  selected: boolean;
  onClick?: (item: Item) => void;
}

export const ResultListItem: React.VFC<ResultListItemProps> = ({
  item,
  onClick,
  selected,
}) => {
  const itemContainerRef = useRef<HTMLLIElement>(null);

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

  const itemImage = useMemo(() => {
    if (
      item.type !== ItemType.Tab ||
      item.favIconUrl == null ||
      item.favIconUrl === ""
    ) {
      return null;
    }
    return <ItemImage src={item.favIconUrl} />;
  }, [item]);

  return useMemo(
    () => (
      <ItemContainer
        onClick={handleClick}
        ref={itemContainerRef}
        selected={selected}
      >
        <ItemLeft>{itemImage}</ItemLeft>
        <ItemRight>
          <ItemTitle>{item.title}</ItemTitle>
          <ItemUrl>{item.url}</ItemUrl>
        </ItemRight>
      </ItemContainer>
    ),
    [handleClick, item, itemImage, selected]
  );
};
