import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Heart, MessageCircle, Send, LogOut, Plus, ShieldCheck,
    MoreHorizontal, Share2, Sparkles, Home, Search, User, Bell,
    ArrowRight, Lock, Shield, MessageSquare, Trash2, Edit, X
} from 'lucide-react';
import CreatePost from './CreatePost';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Feed = ({ user, onLogout, onProfileClick }) => {
    const [posts, setPosts] = useState([]);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [pendingTags, setPendingTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [commentInput, setCommentInput] = useState({});
    const [selectedPostOptions, setSelectedPostOptions] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [editCaption, setEditCaption] = useState('');

    const fetchData = async () => {
        try {
            const { data: feedData } = await axios.get(`${API_BASE_URL}/posts/feed?userId=${user._id}`);
            const { data: storiesData } = await axios.get(`${API_BASE_URL}/posts/stories/${user._id}`);
            const { data: tagData } = await axios.get(`${API_BASE_URL}/posts/tags/pending/${user._id}`);

            setPosts(feedData);
            setFollowingUsers(storiesData);
            setPendingTags(tagData);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user._id]);

    useEffect(() => {
        if (selectedPostOptions || editingPost || showCreatePost) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }, [selectedPostOptions, editingPost, showCreatePost]);

    const handleLike = async (postId, isLiked) => {
        try {
            const endpoint = isLiked ? 'unlike' : 'like';
            await axios.post(`${API_BASE_URL}/posts/${postId}/${endpoint}`, { userId: user._id });
            setPosts(posts.map(post => {
                if (post._id === postId) {
                    const newLikes = isLiked
                        ? post.likes.filter(id => id !== user._id)
                        : [...post.likes, user._id];
                    return { ...post, likes: newLikes };
                }
                return post;
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleComment = async (postId) => {
        const text = commentInput[postId];
        if (!text || !text.trim()) return;

        try {
            await axios.post(`${API_BASE_URL}/posts/${postId}/comment`, {
                userId: user._id,
                text
            });
            setCommentInput({ ...commentInput, [postId]: '' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleTagAction = async (postId, status) => {
        try {
            await axios.patch(`${API_BASE_URL}/posts/${postId}/tag`, {
                userId: user._id,
                status
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this vibe from the vault?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/posts/${postId}`);
            setPosts(posts.filter(p => p._id !== postId));
            setSelectedPostOptions(null);
        } catch (err) {
            alert("Could not delete entry");
        }
    };

    const handleUpdatePost = async () => {
        if (!editingPost) return;
        try {
            await axios.patch(`${API_BASE_URL}/posts/${editingPost._id}`, { caption: editCaption });
            setPosts(posts.map(p => p._id === editingPost._id ? { ...p, caption: editCaption } : p));
            setEditingPost(null);
            setEditCaption('');
        } catch (err) {
            alert("Could not update entry");
        }
    };

    const openEditModal = (post) => {
        setEditCaption(post.caption || '');
        setEditingPost(post);
        setSelectedPostOptions(null);
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-dark text-primary">
            <Sparkles className="animate-spin" />
            <span className="ml-3 font-bold tracking-widest text-sm uppercase">Syncing Vault...</span>
        </div>
    );

    return (
        <div className="dashboard-v3 animate-fade">
            {/* TOP NAVIGATION */}
            <nav className="top-nav-v3">
                <div className="vault-brand">
                    <Shield size={24} />
                    <span>Vault</span>
                </div>
                <div className="nav-actions-v3">
                    <div className="nav-icon-v3" onClick={() => setShowCreatePost(true)}>
                        <Plus size={20} />
                    </div>
                    <div className="nav-icon-v3" onClick={onLogout}>
                        <LogOut size={20} />
                    </div>
                </div>
            </nav>

            {/* STORIES SECTION */}
            <div className="stories-header">Inner Circle</div>
            <div className="stories-row-v3">
                <div className="story-item-v3">
                    <div className="story-ring" style={{ opacity: 0.5 }}>
                        <img src={`https://ui-avatars.com/api/?name=${user.username}&background=a855f7&color=fff`} className="story-avatar-v3" alt="You" />
                    </div>
                    <span className="story-name">You</span>
                </div>
                {followingUsers.map(u => (
                    <div key={u._id} className="story-item-v3">
                        <div className="story-ring">
                            <img src={`https://ui-avatars.com/api/?name=${u.username}&background=random&color=fff`} alt={u.username} className="story-avatar-v3" />
                        </div>
                        <span className="story-name">{u.username}</span>
                    </div>
                ))}
            </div>

            {/* PENDING REQUESTS */}
            <div className="stories-header">Pending Requests</div>
            {pendingTags.length > 0 ? (
                pendingTags.map(post => (
                    <div key={post._id} className="privacy-alert-v3">
                        <div className="alert-header-v3">
                            <img src={post.image} className="alert-thumb" alt="Request" />
                            <div className="alert-text-v3">
                                <h4>Tag Request</h4>
                                <p>@{post.user.username} wants to tag you</p>
                            </div>
                        </div>
                        <div className="alert-btns-v3">
                            <button className="approve-btn-v3" onClick={() => handleTagAction(post._id, 'approved')}>Approve</button>
                            <button className="reject-btn-v3" onClick={() => handleTagAction(post._id, 'rejected')}>Reject</button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="privacy-alert-v3" style={{ opacity: 0.5, textAlign: 'center', padding: '15px' }}>
                    <p style={{ fontSize: '0.8rem' }}>All requests handled. Security optimal.</p>
                </div>
            )}

            {/* FEED POSTS */}
            <div className="stories-header" style={{ marginTop: '20px' }}>Global Sync</div>
            {posts.map(post => {
                const isLiked = post.likes.includes(user._id);
                return (
                    <div key={post._id} className="post-card-v3">
                        <div className="post-header-v3">
                            <div className="post-user-v3">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${post.user.username}&background=random&color=fff`}
                                    className="post-avatar-v3"
                                    alt="User"
                                />
                                <div className="post-info-v3">
                                    <h4>{post.user.username}</h4>
                                    <span><Lock size={10} /> Private Circle</span>
                                </div>
                            </div>
                            <MoreHorizontal
                                size={20}
                                style={{ opacity: 0.5, cursor: 'pointer' }}
                                onClick={() => setSelectedPostOptions(post)}
                            />
                        </div>

                        <div className="post-image-container-v3" onDoubleClick={() => handleLike(post._id, isLiked)}>
                            <img src={post.image} alt="Post" className="post-image-v3" />
                            <div className="post-overlay-v3">
                                <p className="post-caption-v3">"{post.caption}"</p>
                            </div>
                        </div>

                        {/* ENGAGEMENT BAR */}
                        <div style={{ padding: '15px 20px', borderTop: '1px solid var(--border-glass)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
                                <Heart
                                    size={24}
                                    onClick={() => handleLike(post._id, isLiked)}
                                    style={{ cursor: 'pointer', fill: isLiked ? 'var(--secondary)' : 'none', color: isLiked ? 'var(--secondary)' : 'inherit' }}
                                />
                                <MessageCircle size={24} style={{ cursor: 'pointer' }} />
                                <Send size={24} style={{ cursor: 'pointer', opacity: 0.6 }} />
                            </div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
                                {post.likes.length} Likes
                            </div>

                            {post.comments?.length > 0 && (
                                <div style={{ marginBottom: '15px' }}>
                                    {post.comments.slice(0, 2).map((c, i) => (
                                        <div key={i} style={{ fontSize: '0.8rem', marginBottom: '5px' }}>
                                            <span style={{ fontWeight: 800 }}>{c.user?.username}</span> {c.text}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="input-container-v3" style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: 'none' }}>
                                <input
                                    type="text"
                                    placeholder="Add a thought..."
                                    style={{ padding: '10px 15px', fontSize: '0.8rem' }}
                                    value={commentInput[post._id] || ''}
                                    onChange={(e) => setCommentInput({ ...commentInput, [post._id]: e.target.value })}
                                    onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* POST OPTIONS BACKDROP */}
            {selectedPostOptions && (
                <div className="post-options-backdrop" onClick={() => setSelectedPostOptions(null)}>
                    <div className="post-options-menu animate-fade" onClick={e => e.stopPropagation()}>
                        {selectedPostOptions.user._id === user._id ? (
                            <>
                                <div className="option-item-v3 option-danger" onClick={() => handleDeletePost(selectedPostOptions._id)}>
                                    <Trash2 size={16} style={{ marginRight: '10px' }} /> Delete vibe
                                </div>
                                <div className="option-item-v3" onClick={() => openEditModal(selectedPostOptions)}>
                                    <Edit size={16} style={{ marginRight: '10px' }} /> Update caption
                                </div>
                            </>
                        ) : (
                            <div className="option-item-v3 option-danger">Inappropriate vibe</div>
                        )}
                        <div className="option-item-v3" style={{ opacity: 0.5 }} onClick={() => setSelectedPostOptions(null)}>Cancel</div>
                    </div>
                </div>
            )}

            {/* EDIT CAPTION MODAL */}
            {editingPost && (
                <div className="modal-overlay">
                    <div className="modal-card animate-fade">
                        <div className="modal-header-v3">
                            <h3>Edit Entry</h3>
                            <button className="icon-btn-v3" onClick={() => { setEditingPost(null); setEditCaption(''); }}><X size={20} /></button>
                        </div>
                        <div className="modal-body-v3">
                            <label className="section-label-v3">Update Thoughts</label>
                            <textarea
                                className="textarea-v3"
                                value={editCaption}
                                onChange={(e) => setEditCaption(e.target.value)}
                                rows="4"
                                autoFocus
                            />
                            <button className="primary-btn-v3" style={{ marginTop: '20px' }} onClick={handleUpdatePost}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CREATE POST MODAL */}
            {showCreatePost && (
                <CreatePost
                    user={user}
                    onClose={() => setShowCreatePost(false)}
                    onPostCreated={fetchData}
                />
            )}

            {/* BOTTOM NAVIGATION */}
            <div className="bottom-nav-v3">
                <div className="nav-item-v3 active"><Home size={22} /></div>
                <div className="nav-item-v3"><Search size={22} /></div>
                <div className="nav-item-v3" onClick={() => setShowCreatePost(true)}>
                    <div style={{ width: '45px', height: '45px', background: 'var(--rainbow-gradient)', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                        <Plus size={24} />
                    </div>
                </div>
                <div className="nav-item-v3"><Bell size={22} /></div>
                <div className="nav-item-v3" onClick={onProfileClick}><User size={22} /></div>
            </div>
        </div>
    );
};

export default Feed;
