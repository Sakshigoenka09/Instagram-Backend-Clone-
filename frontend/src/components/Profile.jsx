import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ArrowLeft, Grid, Bookmark, User as UserIcon, MoreHorizontal, Lock,
    MessageSquare, Edit3, ShieldCheck, Heart, MessageCircle,
    Home, Search, Plus, User, Shield, Video, UserPlus
} from 'lucide-react';
import SearchModal from './SearchModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile = ({ user, profileUserId, onBack, onAddPost, onProfileClick, onLogout }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSearch, setShowSearch] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');


    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_BASE_URL}/users/profile/${profileUserId}`);
            setProfileData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [profileUserId]);

    const handleFollowToggle = async (isFollowing) => {
        try {
            const endpoint = isFollowing ? 'unfollow' : 'follow';
            await axios.post(`${API_BASE_URL}/users/${endpoint}`, {
                followerId: user._id,
                followingId: profileUserId
            });
            // Re-fetch profile data to get updated followers list
            fetchProfile();
        } catch (err) {
            console.error("Could not toggle follow status:", err);
            alert("Action failed, please try again.");
        }
    };

    const promptDeleteAccount = () => {
        setShowMenu(false);
        setShowPasswordModal(true);
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            alert("Please enter your password to confirm deletion.");
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/users/${user._id}`, {
                data: { password: deletePassword }
            });
            alert("Your account has been successfully deleted.");
            if (onLogout) onLogout();
        } catch (err) {
            console.error("Failed to delete account:", err);
            alert(err.response?.data?.error || "Failed to delete account. Please try again.");
            setDeletePassword(''); // clear password on failure
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-dark text-primary">
            <span className="font-bold tracking-widest text-sm uppercase">Accessing Vault Profile...</span>
        </div>
    );

    const { user: profileUser, posts } = profileData || { user: user, posts: [] };
    const isOwner = profileUser._id === user._id;
    const isFollowing = profileUser.followers?.some(f => f._id === user._id) || false;

    return (
        <>
            {/* TOP BAR */}
            <nav className="top-nav-v3" style={{ maxWidth: '800px' }}>
                <div className="vault-brand" onClick={onBack} style={{ cursor: 'pointer' }}>
                    <ArrowLeft size={24} color="white" />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'white' }}>
                    {profileUser.username.toLowerCase()}
                </div>
                <div className="nav-actions-v3" style={{ position: 'relative' }}>
                    <div style={{ opacity: 0.6, cursor: 'pointer' }} onClick={() => setShowMenu(!showMenu)}>
                        <MoreHorizontal size={24} color="white" />
                    </div>
                    {showMenu && isOwner && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '10px',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '12px',
                            padding: '8px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(20px)',
                            zIndex: 1000,
                            minWidth: '160px'
                        }}>
                            <div 
                                onClick={promptDeleteAccount}
                                style={{
                                    padding: '10px 15px',
                                    color: '#ef4444',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    transition: '0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                Delete Account
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div className="dashboard-v3 animate-fade" style={{ maxWidth: '800px' }}>
            {/* PROFILE HEADER */}
            <div className="profile-header-v3">
                <div className="profile-avatar-outer" style={{ width: '130px', height: '130px' }}>
                    <img
                        src={`https://ui-avatars.com/api/?name=${profileUser.username}&background=random&color=fff&size=200`}
                        alt="Profile"
                        className="profile-avatar-inner"
                    />
                </div>

                <h1 className="profile-name-v3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    {profileUser.username}
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
                        Digital Architect & Visual Explorer
                    </span>
                </h1>

                <p className="profile-bio-v3">
                    Capturing the intersection of light and shadow in the concrete jungle. Tokyo • NY • London.
                </p>

                {/* STATS CARDS */}
                <div className="profile-stats-v3">
                    <div className="stat-card-v3">
                        <b>{posts.length || 0}</b>
                        <span>Posts</span>
                    </div>
                    <div className="stat-card-v3">
                        <b>{profileUser.followers?.length || 0}</b>
                        <span>Followers</span>
                    </div>
                    <div className="stat-card-v3">
                        <b>{profileUser.following?.length || 0}</b>
                        <span>Following</span>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="profile-actions-v3">
                    {isOwner ? (
                        <button className="profile-btn-v3 btn-secondary-v3">Edit Profile</button>
                    ) : (
                        <button 
                            className={`profile-btn-v3 ${isFollowing ? 'btn-secondary-v3' : 'btn-primary-v3'}`}
                            onClick={() => handleFollowToggle(isFollowing)}
                        >
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    )}
                    <button className="profile-btn-v3 btn-secondary-v3">Message</button>
                    <div className="btn-icon-v3">
                        <UserPlus size={20} />
                    </div>
                </div>
            </div>

            {/* TAB SELECTOR */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', marginBottom: '1px' }}>
                <div style={{ flex: 1, padding: '15px', textAlign: 'center', borderBottom: '2px solid white' }}>
                    <Grid size={22} color="white" style={{ margin: '0 auto' }} />
                </div>
                <div style={{ flex: 1, padding: '15px', textAlign: 'center', opacity: 0.4 }}>
                    <Video size={22} color="white" style={{ margin: '0 auto' }} />
                </div>
                <div style={{ flex: 1, padding: '15px', textAlign: 'center', opacity: 0.4 }}>
                    <Bookmark size={22} color="white" style={{ margin: '0 auto' }} />
                </div>
                <div style={{ flex: 1, padding: '15px', textAlign: 'center', opacity: 0.4 }}>
                    <User size={22} color="white" style={{ margin: '0 auto' }} />
                </div>
            </div>

            {/* POSTS GRID */}
            <div className="posts-grid-v3" style={{ gap: '2px', gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '2px' }}>
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post._id} className="grid-item-v3" style={{ borderRadius: 0, border: 'none' }}>
                            <img src={post.image} alt="Post" />
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '100px 0', opacity: 0.3 }}>
                        <Grid size={48} style={{ margin: '0 auto 15px' }} />
                        <p style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.7rem' }}>No entries in the vault yet</p>
                    </div>
                )}
            </div>

            <div style={{ paddingBottom: '100px' }}></div>
            </div>

            {/* PASSWORD CONFIRMATION MODAL */}
            {showPasswordModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div className="auth-card-v3 animate-fade" style={{ width: '90%', maxWidth: '400px', padding: '30px' }}>
                        <h2 style={{ color: '#ef4444', textAlign: 'center', marginBottom: '10px', fontSize: '1.2rem', fontWeight: 800 }}>DANGER ZONE</h2>
                        <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '25px', fontSize: '0.85rem' }}>
                            You are about to permanently delete your account. This will wipe all your posts, likes, and comments. Enter your password to confirm.
                        </p>
                        
                        <div className="input-group-v3">
                            <label className="input-label-v3">Password</label>
                            <div className="input-container-v3">
                                <Lock className="input-icon-v3" size={18} />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button 
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setDeletePassword('');
                                }} 
                                className="submit-btn-v3" 
                                style={{ background: 'transparent', border: '1px solid var(--border-glass)' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteAccount} 
                                className="submit-btn-v3" 
                                style={{ background: '#ef4444' }}
                            >
                                Delete Forever
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SEARCH MODAL */}
            {showSearch && (
                <SearchModal 
                    onClose={() => setShowSearch(false)} 
                    onUserSelect={(userId) => onProfileClick(userId)} 
                />
            )}

            {/* BOTTOM NAVIGATION */}
            <div className="bottom-nav-v3" style={{ maxWidth: '800px' }}>
                <div className="nav-item-v3" onClick={onBack}>
                    <Home size={22} />
                </div>
                <div className="nav-item-v3" onClick={() => setShowSearch(true)} style={{ cursor: 'pointer' }}>
                    <Search size={22} />
                </div>
                <div className="nav-item-v3" onClick={onAddPost} style={{ cursor: 'pointer' }}>
                    <div style={{ width: '45px', height: '45px', background: 'rgba(255,255,255,0.1)', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                        <Plus size={24} />
                    </div>
                </div>
                <div className="nav-item-v3">
                    <Heart size={22} />
                </div>
                <div className="nav-item-v3 active" onClick={() => onProfileClick(user._id)} style={{ cursor: 'pointer' }}>
                    <img
                        src={`https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff`}
                        style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--primary)' }}
                        alt="Me"
                    />
                </div>
            </div>
        </>
    );
};

export default Profile;
