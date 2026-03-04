import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ArrowLeft, Grid, Bookmark, User as UserIcon, MoreHorizontal,
    MessageSquare, Edit3, ShieldCheck, Heart, MessageCircle,
    Home, Search, Plus, User, Shield, Video, UserPlus
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile = ({ user, onBack, onAddPost }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/users/profile/${user._id}`);
                setProfileData(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user._id]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-dark text-primary">
            <span className="font-bold tracking-widest text-sm uppercase">Accessing Vault Profile...</span>
        </div>
    );

    const { user: profileUser, posts } = profileData || { user: user, posts: [] };
    const isOwner = profileUser._id === user._id;

    return (
        <div className="dashboard-v3 animate-fade" style={{ maxWidth: '800px' }}>
            {/* TOP BAR */}
            <nav className="top-nav-v3" style={{ maxWidth: '800px' }}>
                <div className="vault-brand" onClick={onBack} style={{ cursor: 'pointer' }}>
                    <ArrowLeft size={24} color="white" />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'white' }}>
                    {profileUser.username.toLowerCase()}
                </div>
                <div className="nav-actions-v3">
                    <div style={{ opacity: 0.6, cursor: 'pointer' }}>
                        <MoreHorizontal size={24} color="white" />
                    </div>
                </div>
            </nav>

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
                        <button className="profile-btn-v3 btn-primary-v3">Follow</button>
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

            {/* BOTTOM NAVIGATION */}
            <div className="bottom-nav-v3" style={{ maxWidth: '800px' }}>
                <div className="nav-item-v3" onClick={onBack}>
                    <Home size={22} />
                </div>
                <div className="nav-item-v3">
                    <Search size={22} />
                </div>
                <div className="nav-item-v3" onClick={onAddPost}>
                    <div style={{ width: '45px', height: '45px', background: 'rgba(255,255,255,0.1)', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                        <Plus size={24} />
                    </div>
                </div>
                <div className="nav-item-v3">
                    <Heart size={22} />
                </div>
                <div className="nav-item-v3 active">
                    <img
                        src={`https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff`}
                        style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--primary)' }}
                        alt="Me"
                    />
                </div>
            </div>
        </div>
    );
};

export default Profile;
