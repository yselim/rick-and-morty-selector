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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [highlightedTagIndex, setHighlightedTagIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const debounceTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (debounceTimeoutId.current) clearTimeout(debounceTimeoutId.current);

    debounceTimeoutId.current = setTimeout(async () => {
      if (term.trim().length > 0) {
        setLoading(true);
        const foundItems = await searchFunction(term.trim());
        setItems(foundItems);
        setLoading(false);
      } else setItems([]);
      setHighlightedIndex(-1);
    }, 500);
  };

  const onNavigateWithKeyboard = (e: React.KeyboardEvent) => {
    if (
      ["Enter", "ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(
        e.key
      )
    )
      e.preventDefault();
    if (e.key === "ArrowDown") {
      if (items.length === 0) return;
      if (highlightedIndex < items.length - 1)
        setHighlightedIndex(highlightedIndex + 1);
      else setHighlightedIndex(0);

      setHighlightedTagIndex(-1);
    } else if (e.key === "ArrowUp") {
      if (items.length === 0) return;

      if (highlightedIndex > 0) setHighlightedIndex(highlightedIndex - 1);
      else setHighlightedIndex(items.length - 1);

      setHighlightedTagIndex(-1);
    } else if (e.key === "ArrowRight") {
      if (Object.keys(selectedItems).length === 0) return;
      if (highlightedTagIndex < Object.keys(selectedItems).length - 1)
        setHighlightedTagIndex(highlightedTagIndex + 1);
      else setHighlightedTagIndex(0);

      setHighlightedIndex(-1);
    } else if (e.key === "ArrowLeft") {
      if (Object.keys(selectedItems).length === 0) return;

      if (highlightedTagIndex > 0)
        setHighlightedTagIndex(highlightedTagIndex - 1);
      else setHighlightedTagIndex(Object.keys(selectedItems).length - 1);
      setHighlightedIndex(-1);
    } else if (e.key === "Enter") {
      if (highlightedIndex !== -1) {
        let selectedItem = items[highlightedIndex];
        onItemChecked(selectedItem, !selectedItems[selectedItem.id]);
      } else if (highlightedTagIndex !== -1) {
        let selectedItem = Object.values(selectedItems)[highlightedTagIndex];
        onItemChecked(selectedItem, false);
      }
    }
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
    <>
      <span className={styles.explanationTexts}>
        Arama kutusunda sağ/sol tuşlarını kullanarak seçili karakterler üzerinde
        hareket edebilirsiniz. Enter tuşu ile seçimi kaldırabilirsiniz.
      </span>
      <div className={styles.searchContainer}>
        {Object.keys(selectedItems).map((key, index) => {
          const item_id = Number(key);
          return (
            <span
              key={item_id}
              className={
                styles.selectedNameBox +
                " " +
                (index === highlightedTagIndex
                  ? styles.highlightedSelectedNameBox
                  : "")
              }
            >
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
          ref={inputRef}
        />
      </div>
    </>
  );

  const loadingBar = (
    <div className={styles.loadingWrapper}>
      <span className={styles.loader}></span>
    </div>
  );

  const resultList = (
    <>
      <span className={styles.explanationTexts}>
        Yukarı/aşağı tuşlarını kullanarak aşağıdaki liste üzerinde hareket
        edebilirsiniz. Enter tuşu ile seçim yapabilirsiniz.
      </span>
      <div className={styles.itemTable}>
        {items.map((c, index) => {
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

          let rowClassNames = styles.titleRow;
          if (index === highlightedIndex) {
            rowClassNames += ` ${styles.highlightedRow}`;
          }

          return (
            <div
              className={rowClassNames}
              key={c.id}
              onClick={() => setHighlightedIndex(index)}
            >
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
    </>
  );

  return (
    <div
      className={styles.wrapper}
      onKeyDown={onNavigateWithKeyboard}
      onClick={() => inputRef.current?.focus()}
    >
      <div className={styles.multiSelectContainer}>
        {searcher}
        {loading && loadingBar}
        {resultList}
      </div>
    </div>
  );
}
