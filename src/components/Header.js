import React from 'react';
import '/src/styles/style.scss';
import userEmail from "../pages/SigninPage";

const Header = () => {

    return (
        <header>
            <div className="main-header-container">
                <div className='left-side'>
                    <h2>CashCompass</h2>
                    <div className='header-page-buttons'>
                    <h3>Dashboard{userEmail}</h3>
                    <h3>Transactions</h3>
                    <h3>Reports</h3>
                    </div>
                </div>
                <div className="right-side">
                    <input type='text'></input>
                    <div className='square'></div>
                </div>
            </div>
        </header>
    )

}

export default Header;