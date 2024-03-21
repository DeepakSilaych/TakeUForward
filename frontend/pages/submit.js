import { useState } from 'react';
import styles from '@/styles/submit.module.css';
import Link from 'next/link';

export default function Submit() {
    const [formData, setFormData] = useState({
        username: '',
        code_language: '',
        stdin: '',
        source_code: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert('Code snippet submitted successfully!');
            } else {
                throw new Error('Failed to submit code snippet');
            }
        } catch (error) {
            console.error('Error submitting code snippet: ', error);
            alert('Failed to submit code snippet. Please try again.');
        }
    };

    return (
        <div className={styles.container}>
        <Link href="/">home</Link>
            <h1 className={styles.heading}>Submit Code Snippet</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.form_group}>
                    <label htmlFor="username" className={styles.label}>Username:</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className={styles.input_field} required />
                </div>
                <div className={styles.form_group}>
                    <label htmlFor="code_language" className={styles.label}>Code Language:</label>
                    <input type="text" id="code_language" name="code_language" value={formData.code_language} onChange={handleChange} className={styles.input_field} required />
                </div>
                <div className={styles.form_group}>
                    <label htmlFor="stdin" className={styles.label}>Standard Input:</label>
                    <input type="text" id="stdin" name="stdin" value={formData.stdin} onChange={handleChange} className={styles.input_field} required />
                </div>
                <div className={styles.form_group}>
                    <label htmlFor="source_code" className={styles.label}>Source Code:</label>
                    <textarea id="source_code" name="source_code" value={formData.source_code} onChange={handleChange} className={styles.textarea_field} required />
                </div>
                <button type="submit" className={styles.submit_btn}>Submit</button>
            </form>
        </div>
    );
}
