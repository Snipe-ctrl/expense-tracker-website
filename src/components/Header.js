import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AccountSettings from '../pages/AccountSettings';
import userEmail from "../pages/SigninPage";
import '/src/styles/style.scss';


const Header = () => {
    const navigate = useNavigate();

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
                    <h3 onClick={() => navigate('/dashboard')}>Dashboard</h3>
                    <h3 onClick={() => navigate('/transactions')}>Transactions</h3>
                    <h3>Reports</h3>
                    </div>
                </div>
                <div className="right-side">
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