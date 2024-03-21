import { useEffect, useState } from 'react';

export default function CodeSnippets() {
    const [codeSnippets, setCodeSnippets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/code-snippets');
                if (response.ok) {
                    const data = await response.json();
                    setCodeSnippets(data);
                } else {
                    throw new Error('Failed to fetch code snippets');
                }
            } catch (error) {
                console.error('Error fetching code snippets: ', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Code Snippets</h1>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Code Language</th>
                        <th>Standard Input</th>
                        <th>Source Code (First 100 characters)</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {codeSnippets.map(snippet => (
                        <tr key={snippet.id}>
                            <td>{snippet.username}</td>
                            <td>{snippet.code_language}</td>
                            <td>{snippet.stdin}</td>
                            <td>{snippet.truncated_source_code}</td>
                            <td>{snippet.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
