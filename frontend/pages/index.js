import Link from 'next/link';
import styles from '@/styles/index.module.css';

export default function Home() {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Welcome to Code Snippet App</h1>
            <Link href="/submit">
                <h2 className={styles.link}>Submit Code Snippet</h2>
            </Link>
            <br />
            <Link href="/code-snippets">
                <h2 className={styles.link}>View Code Snippets</h2>
            </Link>
        </div>
    );
}
