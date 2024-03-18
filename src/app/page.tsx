"use client";

import { fetchCharactersByName } from "@/backendInterface/apiQueries";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [episodes, setEpisodes] = useState([]);

  const onInputChange = async(e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if(term.length > 2) {
      const characters = await fetchCharactersByName(term);
      console.log(characters);
    }
  };

  const searcher = (
    <div>
      <input
        type="text"
        value={searchTerm}
        placeholder="Search"
        onChange={onInputChange}
      />
    </div>
  );

  const resultList = <div>RESULT LIST</div>;

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
