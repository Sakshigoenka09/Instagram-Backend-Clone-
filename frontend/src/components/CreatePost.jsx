import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Image, Tag, Send, Sparkles, ShieldCheck, Search, Users, ShieldAlert, Plus, Upload } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CreatePost = ({ user, onClose, onPostCreated }) => {
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [tagInput, setTagInput] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Lock body scroll when modal is open
        document.body.classList.add('modal-open');

        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/users/');
                setAllUsers(data.filter(u => u._id !== user._id));
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [user._id]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleAddTag = (userId) => {
        if (!selectedTags.includes(userId)) {
            setSelectedTags([...selectedTags, userId]);
        }
        setTagInput('');
    };

    const removeTag = (id) => {
        setSelectedTags(selectedTags.filter(t => t !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select an image from your gallery!");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('userId', user._id);
            formData.append('caption', caption);
            formData.append('image', file);
            formData.append('tags', JSON.stringify(selectedTags));

            await axios.post(`${API_BASE_URL}/posts/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onPostCreated();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Error sharing post to the vault');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card animate-fade">
                {/* Modal Header */}
                <div className="modal-header-v3">
                    <div>
                        <h3>Create New Entry</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', opacity: 0.5 }}>
                            <ShieldCheck size={12} style={{ color: 'var(--primary)' }} />
                            <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Secured Vault</span>
                        </div>
                    </div>
                    <button className="icon-btn-v3" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body-v3">
                    {/* Visual Content SECTION - NOW FILE UPLOAD */}
                    <div className="input-section-v3">
                        <label className="section-label-v3">From Your Gallery</label>
                        <div
                            className="input-container-v3"
                            style={{
                                height: '200px',
                                borderStyle: 'dashed',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                padding: 0,
                                overflow: 'hidden'
                            }}
                            onClick={() => fileInputRef.current.click()}
                        >
                            {preview ? (
                                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <>
                                    <Upload className="input-icon-v3" size={32} style={{ position: 'relative', left: 0, transform: 'none', marginBottom: '10px' }} />
                                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Upload high-res entry...</span>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Thoughts SECTION */}
                    <div className="input-section-v3">
                        <label className="section-label-v3">Thoughts</label>
                        <textarea
                            rows="3"
                            placeholder="Share your thoughts in emerald luxury..."
                            className="textarea-v3"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                    </div>

                    {/* Tagging SECTION */}
                    <div className="input-section-v3">
                        <label className="section-label-v3">Secure Tagging</label>
                        <div className="input-container-v3">
                            <Search className="input-icon-v3" size={18} />
                            <input
                                type="text"
                                placeholder="Search friends to invite..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                            />
                        </div>

                        {/* User Search List */}
                        {tagInput && (
                            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', marginTop: '10px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                                {allUsers.filter(u => u.username.toLowerCase().includes(tagInput.toLowerCase())).map(u => (
                                    <div
                                        key={u._id}
                                        style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid var(--border-glass)' }}
                                        onClick={() => handleAddTag(u._id)}
                                    >
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{u.username}</span>
                                        <Plus size={16} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Selected Tags List */}
                        <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {selectedTags.map(id => {
                                const u = allUsers.find(user => user._id === id);
                                return (
                                    <div key={id} style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '6px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>@{u?.username}</span>
                                        <X size={14} className="cursor-pointer" onClick={() => removeTag(id)} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <button type="submit" className="primary-btn-v3" disabled={loading}>
                            {loading ? <Sparkles className="animate-spin" size={20} /> : <Send size={20} />}
                            {loading ? 'Publishing Entry...' : 'Share Entry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
