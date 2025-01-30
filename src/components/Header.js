import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AccountSettings from '../pages/AccountSettings';
import userEmail from "../pages/SigninPage";
import '/src/styles/style.scss';

const Header = () => {

    const { user, loading } = useContext(AuthContext)
    const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <header>
            <div className="main-header-container">
                <div className='left-side'>
                    <h2>CashCompass</h2>
                    <div className='header-page-buttons'>
                    <h3>Dashboard</h3>
                    <h3>Transactions</h3>
                    <h3>Reports</h3>
                    </div>
                </div>
                <div className="right-side">
                    <input type='text'></input>
                    <img src={user.profile_picture_url} onClick={() => setIsAccountSettingsOpen(true)}></img>
                </div>
            </div>
            {isAccountSettingsOpen ? (
                <AccountSettings onClose={() => setIsAccountSettingsOpen(false)}/>
            ) : null}
        </header>
    )

}

export default Header;