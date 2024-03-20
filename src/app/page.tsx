"use client";

import {
  fetchCharactersByName,
  Character,
} from "@/backendInterface/apiQueries";
import styles from "./page.module.css";
import { useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<{ [key: number]: Character }>({});

  const debounceTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  
    if (debounceTimeoutId.current) clearTimeout(debounceTimeoutId.current);
  
    debounceTimeoutId.current = setTimeout(async () => {
      if (term.trim().length > 0) {
        const res = await fetchCharactersByName(term.trim());
        if (res.results) {
          setCharacters(res.results);
        } else {
          setCharacters([]);
        }
      } else setCharacters([]);
    }, 500);
  };

  const onCharacterChecked = (c: Character, isChecked: boolean) => {
    let selectedChars = { ...selectedCharacters };
    if (isChecked) {
      selectedChars[c.id] = c;
    } else delete selectedChars[c.id];
    setSelectedCharacters(selectedChars);
  };

  const searcher = (
    <div className={styles.searchContainer}>
      {Object.keys(selectedCharacters).map((key) => {
        const char_id = Number(key);
        return (
          <span key={char_id} className={styles.selectedNameBox}>
            {selectedCharacters[char_id].name}
            <Image
              alt="close"
              src="/close_image.png"
              width={25}
              height={25}
              style={{ margin: 5 }}
              onClick={() => {
                onCharacterChecked(selectedCharacters[char_id], false);
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
    <div className={styles.characterTable}>
      {characters.map((c) => {
        let trimmedSearchTerm = searchTerm.trim().toLocaleLowerCase();
        let startIndexOfTheHighlight = c.name
          .toLowerCase()
          .indexOf(trimmedSearchTerm);

        let characterNameFirstPart = c.name.substring(
          0,
          startIndexOfTheHighlight
        );
        let characterNameSecondPart = c.name.substring(
          startIndexOfTheHighlight,
          startIndexOfTheHighlight + trimmedSearchTerm.length
        );
        let characterNameLastPart = c.name.substring(
          startIndexOfTheHighlight + trimmedSearchTerm.length,
          c.name.length
        );

        return (
          <div className={styles.characterRow} key={c.id}>
            <input
              name={c.id.toString()}
              type="checkbox"
              className={styles.rowCheckBox}
              checked={!!selectedCharacters[c.id]}
              onChange={(e) => onCharacterChecked(c, e.target.checked)}
            />
            <Image
              src={c.image}
              alt={c.name}
              width={60}
              height={60}
              className={styles.characterImage}
            />

            <div className={styles.characterInfoContainer}>
              <span className={styles.characterName}>
                <span>{characterNameFirstPart}</span>
                <strong>{characterNameSecondPart}</strong>
                <span>{characterNameLastPart}</span>
              </span>
              <span className={styles.characterEpisode}>
                {c.episode.length + " Episodes"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <div className={styles.selectorContainer}>
          {searcher}
          {resultList}
        </div>
      </div>
    </main>
  );
}
