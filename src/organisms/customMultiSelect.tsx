"use client";

import styles from "./customMultiSelect.module.css";
import { useState, useRef } from "react";
import Image from "next/image";

export interface MultiSelectItem {
  id: number;
  title: string;
  imageUrl: string;
  subTitle: string;
}
interface CustomMultiSelectProps {
  searchFunction: (searchTerm: string) => Promise<MultiSelectItem[]>;
  collectResultCallBack: (selectedIds: number[]) => void;
}

export default function CustomMultiSelect({
  searchFunction,
  collectResultCallBack,
}: CustomMultiSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<MultiSelectItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{
    [key: number]: MultiSelectItem;
  }>({});

  const debounceTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (debounceTimeoutId.current) clearTimeout(debounceTimeoutId.current);

    debounceTimeoutId.current = setTimeout(async () => {
      if (term.trim().length > 0) {
        const foundItems = await searchFunction(term.trim());
        setItems(foundItems);
      } else setItems([]);
    }, 500);
  };

  const onItemChecked = (c: MultiSelectItem, isChecked: boolean) => {
    let selectedItemList = { ...selectedItems };
    if (isChecked) {
      selectedItemList[c.id] = c;
    } else delete selectedItemList[c.id];
    setSelectedItems(selectedItemList);
    collectResultCallBack(Object.keys(selectedItemList).map((k) => Number(k)));
  };

  const searcher = (
    <div className={styles.searchContainer}>
      {Object.keys(selectedItems).map((key) => {
        const item_id = Number(key);
        return (
          <span key={item_id} className={styles.selectedNameBox}>
            {selectedItems[item_id].title}
            <Image
              alt="close"
              src="/close_image.png"
              width={25}
              height={25}
              style={{ margin: 5, cursor: "pointer" }}
              onClick={() => {
                onItemChecked(selectedItems[item_id], false);
              }}
            />
          </span>
        );
      })}

      <input
        type="text"
        value={searchTerm}
        placeholder="Search"
        onChange={onInputChange}
        className={styles.selectorInput}
      />
    </div>
  );

  const resultList = (
    <div className={styles.itemTable}>
      {items.map((c) => {
        let trimmedSearchTerm = searchTerm.trim().toLocaleLowerCase();
        let startIndexOfTheHighlight = c.title
          .toLowerCase()
          .indexOf(trimmedSearchTerm);

        let titleFirstPart = c.title.substring(0, startIndexOfTheHighlight);
        let titleSecondPart = c.title.substring(
          startIndexOfTheHighlight,
          startIndexOfTheHighlight + trimmedSearchTerm.length
        );
        let titleLastPart = c.title.substring(
          startIndexOfTheHighlight + trimmedSearchTerm.length,
          c.title.length
        );

        return (
          <div className={styles.titleRow} key={c.id}>
            <input
              name={c.id.toString()}
              type="checkbox"
              className={styles.rowCheckBox}
              checked={!!selectedItems[c.id]}
              onChange={(e) => onItemChecked(c, e.target.checked)}
            />
            <Image
              src={c.imageUrl}
              alt={c.title}
              width={60}
              height={60}
              className={styles.itemImageStyle}
            />

            <div className={styles.itemInfoContainer}>
              <span className={styles.itemTitleStyle}>
                <span>{titleFirstPart}</span>
                <strong>{titleSecondPart}</strong>
                <span>{titleLastPart}</span>
              </span>
              <span className={styles.subTitleStyle}>{c.subTitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.multiSelectContainer}>
        {searcher}
        {resultList}
      </div>
    </div>
  );
}
