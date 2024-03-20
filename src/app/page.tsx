import styles from "./page.module.css";
import CustomMultiSelect from "@/organisms/customMultiSelect";

export default function Home() {
  return (
    <main className={styles.main}>
      <CustomMultiSelect />
    </main>
  );
}
