"use client";
import { fetchCharactersByName } from "@/backendInterface/apiQueries";
import styles from "./page.module.css";
import CustomMultiSelect, {
  MultiSelectItem,
} from "@/organisms/customMultiSelect";
import { useEffect, useState } from "react";

export default function Home() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    console.log("Selected Ids: ", selectedIds);
    // do whatever you want with selectedIds
  }, [selectedIds]);

  const fetchCharactersAndConvertToMenuItems = async (searchTerm: string) => {
    const characters = await fetchCharactersByName(searchTerm);
    let items: MultiSelectItem[] = characters.map((c) => {
      return {
        id: c.id,
        title: c.name,
        subTitle: c.episode.length + " Episodes",
        imageUrl: c.image,
      };
    });

    return items;
  };

  return (
    <main className={styles.main}>
      <CustomMultiSelect
        searchFunction={fetchCharactersAndConvertToMenuItems}
        collectResultCallBack={setSelectedIds}
      />
    </main>
  );
}
