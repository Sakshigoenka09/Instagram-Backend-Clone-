import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, X, User } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SearchModal = ({ onClose, onUserSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const searchUsers = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const { data } = await axios.get(`${API_BASE_URL}/users/search?query=${query}`);
                setResults(data);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(searchUsers, 300); // debounce search
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="modal-overlay" style={{ zIndex: 1000 }} onClick={onClose}>
            <div className="modal-card animate-fade" style={{ maxWidth: '500px', width: '90%', marginTop: '10vh' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header-v3">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Search size={20} /> Identity Search
                    </h3>
                    <button className="icon-btn-v3" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="modal-body-v3">
                    <input 
                        type="text" 
                        className="input-container-v3" 
                        style={{ width: '100%', marginBottom: '20px', padding: '12px 15px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-glass)', borderRadius: '12px' }}
                        placeholder="Search for an identity..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    
                    <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {loading && <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.9rem' }}>Searching the vault...</div>}
                        {!loading && query && results.length === 0 && (
                            <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.9rem' }}>No matching identities found.</div>
                        )}
                        {!loading && results.map(u => (
                            <div 
                                key={u._id} 
                                style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                onClick={() => {
                                    onUserSelect(u._id);
                                    onClose();
                                }}
                            >
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${u.username}&background=random&color=fff`} 
                                    alt={u.username} 
                                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                />
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{u.username}</div>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{u.followers?.length || 0} Followers</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
