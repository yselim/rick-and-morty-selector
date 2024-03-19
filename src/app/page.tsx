"use client";

import {
  fetchCharactersByName,
  Character,
} from "@/backendInterface/apiQueries";
import styles from "./page.module.css";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState({}); // {id: true}

  const onInputChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim().length > 2) {
      const res = await fetchCharactersByName(term.trim());
      if (res.results) {
        setCharacters(res.results);
      } else {
        setCharacters([]);
      }
    }
  };

  const onCharacterChecked = (e) => {
    const id = e.target.name;
    let selectedChars = {...selectedCharacters};
    if(e.target.checked){
      selectedChars[id]  = true;
    }
    else delete selectedChars[id];
    setSelectedCharacters(selectedChars);
    console.log('selectedChars', selectedChars)
  }

  const searcher = (
    <div>
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
        let startIndexOfTheHighlight = c.name.toLowerCase().indexOf(trimmedSearchTerm);

        let characterNameFirstPart = c.name.substring(0, startIndexOfTheHighlight);
        let characterNameSecondPart = c.name.substring(startIndexOfTheHighlight, startIndexOfTheHighlight + trimmedSearchTerm.length);
        let characterNameLastPart = c.name.substring(startIndexOfTheHighlight + trimmedSearchTerm.length, c.name.length);

        return (
          <div className={styles.characterRow} key={c.id}>
            <input name={c.id.toString()} type="checkbox" className={styles.rowCheckBox} checked={selectedCharacters[c.id]?? false} onChange={onCharacterChecked}/>
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
                <strong >{characterNameSecondPart}</strong>
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
