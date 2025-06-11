import React from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
    header: {
        width: '100%',
        backgroundColor: '#FFD54F',
        padding: '20px 0 10px 0',
        marginBottom: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    headerRow: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerBackButton: {
        backgroundColor: '#FFD54F',
        border: 'none',
        borderRadius: 8,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        padding: '8px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center' as 'center',
        flex: 1,
    },
};

export default function Header({ title }: { title: string }) {
    const navigate = useNavigate();
    return (
        <header style={styles.header}>
            <div style={styles.headerRow}>
                <button
                    style={styles.headerBackButton}
                    onClick={() => navigate(-1)}
                    aria-label="Voltar"
                >
                    ← Voltar
                </button>
                <span style={styles.headerTitle}>{title}</span>
                <span style={{ width: 80 }} />
            </div>
        </header>
    );
}