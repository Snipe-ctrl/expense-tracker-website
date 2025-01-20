import React, { useState } from "react";
import '/src/styles/style.scss';

const AccountSettings = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openModel = () => setIsOpen(true);
    const closeModel = () => setIsOpen(false);

    return (
        <div className="overlay">
            <div className="account-settings-container">
                <div className="account-settings-header-container">
                    <div className="account-settings-header">
                        <h2>Account Settings</h2>
                        <svg width="12" height="13" className="x" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.5445 2.79448C11.984 2.35503 11.984 1.64136 11.5445 1.2019C11.1051 0.762451 10.3914 
        0.762451 9.95197 1.2019L6.25001 4.90737L2.54454 1.20542C2.10509 0.765967 1.39142 0.765967 0.951965 
        1.20542C0.512512 1.64487 0.512512 2.35854 0.951965 2.798L4.65743 6.49995L0.955481 10.2054C0.516028 
        10.6449 0.516028 11.3585 0.955481 11.798C1.39493 12.2375 2.10861 12.2375 2.54806 11.798L6.25001 
        8.09253L9.95548 11.7945C10.3949 12.2339 11.1086 12.2339 11.5481 11.7945C11.9875 11.355 11.9875 
        10.6414 11.5481 10.2019L7.84259 6.49995L11.5445 2.79448Z" fill="#6B7280"/>
        </svg>
                    </div>
                </div>
                <form>
                <div className="account-info-container">
                    <div className="profile-photo-container">
                        <div className="circle"></div>
                        <button>Change photo</button>
                    </div>
                    <div className="account-settings-input-container">
                        <label for="name">Full Name</label>
                        <input type="text" placeholder="John Doe" name="name"></input>
                    </div>
                    <div className="account-settings-input-container">
                        <label for="email">Email</label>
                        <input type="text" placeholder="john@example.com" name="email"></input>
                    </div>
                    <div className="account-settings-input-container">
                        <label for="password">Password</label>
                        <input type="text" placeholder="•••••••••••••" name="password"></input>
                    </div>
                    <div className="account-settings-input-container">
                        <label for="timezone">Timezone</label>
                        <select id="timezone" name="timezone">
                            <option value="PT">Pacific Time (PT)</option>
                        </select>
                    </div>
                </div>
                <div className="submit-account-settings-container">
                    <div className="submit-account-settings">
                    <button className="cancel-button">Cancel</button>
                    <button className="save-changes-button" type="submit">Save Changes</button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    )
}

export default AccountSettings;