import DollList from '@/components/DollList'
import styles from '@/styles/Home.module.css'
export default function Dolls() {
  // NOTE:
  // Layout
  // ┌─────┬─────────┐
  // │     │         │
  // │     │    B    │
  // │  A  │         │
  // │     ├─────────┤
  // │     │    C    │
  // └─────┴─────────┘
  // A: doll list
  // B: info form
  // C: save/info text

  let mock: string[] = ['croque', 'hubble', 'florence']
  return (
    <>
      <main className={styles.main}>
        <h1>dolls page</h1>
        <DollList list={mock} />
      </main>
    </>
  )
}
