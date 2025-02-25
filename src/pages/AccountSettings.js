import React, { useState, useRef, useEffect, useContext } from "react";
import { AuthContext, setUser } from "../context/AuthContext";
import '/src/styles/style.scss';

const AccountSettings = ({ onClose }) => {
    // gets user context
    const { user, setUser, loading } = useContext(AuthContext);
    const token = localStorage.getItem("accessToken");

    // handles setting user data
    const [userData, setUserData] = useState({
        full_name: '',
        email: '',
        timezone: 'pt',
        profile_picture_url: 'https://expense-tracker-bucket01.s3.us-east-2.amazonaws.com/profile-pictures/Default_pfp.jpg',
    })

    // handles setting overlay visible or not visible
    const [isOverlayVisible, setIsOverlayVisible] = useState(true)

    const closeModel = () => {
        setIsOverlayVisible(false);
        if (onClose) onClose();
    };

    // handles change profile photo logic
    const fileInputRef = useRef(null);
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // handles changing profile photo
    const uploadProfilePhoto = async (file) => {

        if (!user) {
            console.error('User is not logged in or user ID is missing');
            return;
        }

        const formData = new FormData();
        formData.append('profilePicture', file);
        formData.append('userId', user.id);
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/upload-profile-picture`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                console.error('Failed to upload file');
                return;
            };

            const data = await response.json();

            // updates user profile photo right away
            setUserData((prevUserData) => ({
                ...prevUserData,
                profile_picture_url: data.url,
            }));

            return data.url;
        } catch (err) {
            console.error('Error uploading file', err);
        }
    }

    // send account setting changes to api
    const updateAccountSettings = async (userData) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/update-account-settings`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            })

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error updating user data', errorData.message);
                return;
            }

            const result = await response.json();
            return result;
        } catch (err) {
            console.error('Error during account settings update', err);
        }
    };

    // handles account settings form submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        setUserData((prevUser) => ({
            ...prevUser,
            full_name: userData.full_name,
            timezone: userData.timezone,
            profile_picture_url: userData.profile_picture_url,
        }));

        const payload = {
            id: user.id,
            email: userData.email,
            full_name: userData.full_name,
            timezone: userData.timezone,
            profile_picture_url: userData.profile_picture_url,
        };

        const result = await updateAccountSettings(payload);

        if (result) {
            console.log('User data updated successfully:', result);
        }

        // updated user context data
        setUser((prevUser) => ({
            ...prevUser,
            full_name: result.user.full_name,
            profile_picture_url: result.user.profile_picture_url,
        }));

        setUserData((prevUser) => ({
            ...prevUser,
            full_name: result.user.full_name,
            email: result.user.email,
            timezone: result.user.timezone,
            profile_picture_url: result.user.profile_picture_url,
        }));

        closeModel();
    }

    // fetches user data
    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                console.log("🖼️ User Profile Picture URL:", user?.profile_picture_url);
                setUserData({
                    full_name: user.full_name || '',
                    email: user.email || '',
                    timezone: user.timezone || 'pt',
                    profile_picture_url: user.profile_picture_url || 'https://expense-tracker-bucket01.s3.us-east-2.amazonaws.com/profile-pictures/Default_pfp.jpg',
                })
            }
        }
        fetchUserData();
    }, [user]);

    // account settings html
    return (
        <div className={`overlay ${isOverlayVisible ? 'visible' : 'hidden'}`}>
            <div className="account-settings-container">
                <div className="account-settings-header-container">
                    <div className="account-settings-header">
                        <h2>Account Settings</h2>
                        <svg onClick={closeModel} width="12" height="13" className="x" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.5445 2.79448C11.984 2.35503 11.984 1.64136 11.5445 1.2019C11.1051 0.762451 10.3914 
                            0.762451 9.95197 1.2019L6.25001 4.90737L2.54454 1.20542C2.10509 0.765967 1.39142 0.765967 0.951965 
                            1.20542C0.512512 1.64487 0.512512 2.35854 0.951965 2.798L4.65743 6.49995L0.955481 10.2054C0.516028 
                            10.6449 0.516028 11.3585 0.955481 11.798C1.39493 12.2375 2.10861 12.2375 2.54806 11.798L6.25001 
                            8.09253L9.95548 11.7945C10.3949 12.2339 11.1086 12.2339 11.5481 11.7945C11.9875 11.355 11.9875 
                            10.6414 11.5481 10.2019L7.84259 6.49995L11.5445 2.79448Z" fill="#6B7280"/>
                        </svg>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                <div className="account-info-container">
                    <div className="profile-photo-container">
                        <img src={userData.profile_picture_url}></img>
                        <button type="button" onClick={triggerFileInput}>Change photo</button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="image"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(event) => uploadProfilePhoto(event.target.files[0])}
                        />
                    </div>
                    <div className="account-settings-input-container">
                        <label htmlFor="name">Full Name</label>
                        <input 
                            type="text" 
                            placeholder="John Doe" 
                            name="name"
                            value={userData.full_name}
                            onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                        />
                    </div>
                    <div className="account-settings-input-container">
                        <label 
                        htmlFor="email">Email</label>
                        <input
                            className="account-settings-email-input"
                            type="text" 
                            value={userData.email} 
                            name="email" 
                            disabled
                        />
                    </div>
                    <div className="account-settings-input-container">
                        <label htmlFor="password">Password</label>
                        <div className="account-settings-password-reset-container">
                            <input 
                                type="text" 
                                placeholder="•••••••••••••" 
                                name="password"
                                disabled
                            />
                            <button>
                                <svg 
                                    width="15" 
                                    height="15" 
                                    viewBox="0 0 15 15" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                <path 
                                    d="M9.60938 10.125C12.2672 10.125 14.4219 7.97031 14.4219 5.3125C14.4219 2.65469 
                                    12.2672 0.5 9.60938 0.5C6.95156 0.5 4.79688 2.65469 4.79688 5.3125C4.79688 5.82383 
                                    4.87617 6.31875 5.02383 6.78086L0.613281 11.1914C0.490234 11.3145 0.421875 11.4812 
                                    0.421875 11.6562V13.8438C0.421875 14.2074 0.714453 14.5 1.07812 14.5H3.26562C3.6293 
                                    14.5 3.92188 14.2074 3.92188 13.8438V12.75H5.01562C5.3793 12.75 5.67188 12.4574 5.67188 
                                    12.0938V11H6.76562C6.94063 11 7.10742 10.9316 7.23047 10.8086L8.14102 9.89805C8.60312 
                                    10.0457 9.09805 10.125 9.60938 10.125ZM10.7031 3.125C10.9932 3.125 11.2714 3.24023 11.4765 
                                    3.44535C11.6816 3.65047 11.7969 3.92867 11.7969 4.21875C11.7969 4.50883 11.6816 4.78703 
                                    11.4765 4.99215C11.2714 5.19727 10.9932 5.3125 10.7031 5.3125C10.413 5.3125 10.1348 5.19727
                                    9.92973 4.99215C9.72461 4.78703 9.60938 4.50883 9.60938 4.21875C9.60938 3.92867 9.72461 3.65047 
                                    9.92973 3.44535C10.1348 3.24023 10.413 3.125 10.7031 3.125Z" fill="#2563EB"
                                />
                                </svg>
                                Reset</button>
                        </div>
                    </div>
                    <div className="account-settings-input-container">
                        <label htmlFor="timezone">Timezone</label>
                        <select id="timezone" name="timezone">
                            <option value="PT">Pacific Time (PT)</option>
                        </select>
                    </div>
                </div>
                <div className="submit-account-settings-container">
                    <div className="submit-account-settings">
                    <button 
                        className="cancel-button" 
                        onClick={(event) => {
                            event.preventDefault();
                            closeModel();
                        }}
                    >
                        Cancel
                    </button>
                    <button className="save-changes-button" type="submit">Save Changes</button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    )
}

export default AccountSettings;