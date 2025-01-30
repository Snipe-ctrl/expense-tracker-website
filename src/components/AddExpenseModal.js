import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../context/AuthContext";

const AddExpenseModal = () => {

    const [isOverlayVisible, setIsOverlayVisible] = useState(true)

    const closeModel = () => {
        setIsOverlayVisible(false);
        if (onClose) onClose();
    };

    return isOverlayVisible ? (
        <div className={`overlay ${isOverlayVisible ? 'visible' : 'hidden'}`}>
            <div className='add-expense-container'>
                <div className='add-expense-header'>
                    <h2>Add New Transaction</h2>
                    <svg onClick={closeModel} width="12" height="13" className="x" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.5445 2.79448C11.984 2.35503 11.984 1.64136 11.5445 1.2019C11.1051 0.762451 10.3914 
                        0.762451 9.95197 1.2019L6.25001 4.90737L2.54454 1.20542C2.10509 0.765967 1.39142 0.765967 0.951965 
                        1.20542C0.512512 1.64487 0.512512 2.35854 0.951965 2.798L4.65743 6.49995L0.955481 10.2054C0.516028 
                        10.6449 0.516028 11.3585 0.955481 11.798C1.39493 12.2375 2.10861 12.2375 2.54806 11.798L6.25001 
                        8.09253L9.95548 11.7945C10.3949 12.2339 11.1086 12.2339 11.5481 11.7945C11.9875 11.355 11.9875 
                        10.6414 11.5481 10.2019L7.84259 6.49995L11.5445 2.79448Z" fill="#6B7280"/>
                    </svg>
                </div>
                <div className="add-expense-description-container">
                    <label htmlFor="description">Description</label>
                    <input 
                        type="text" 
                        name="description"
                        value=''
                    />
                </div>
                <div className='add-expense-amount-date-container'>
                    <div className='add-expense-amount-container'>
                        <label htmlFor="amount">Amount</label>
                        <div className='amount-input-wrapper'>
                            <p className='currency-symbol'>$</p>
                            <input type="text" name="amount" id='expense-amount'/>
                        </div>
                    </div>
                    <div className='add-expense-date-container'>
                        <label htmlFor="date">Date</label>
                        <input type="date" name="date" id='expense-date'/>
                    </div>
                </div>
                <div className='add-expense-category-container'>
                    <label htmlFor="category">Category</label>
                    <select name='category' id='category'>
                        <option value='food'>Food</option>
                        <option value='entertainment'>Entertainment</option>
                        <option value='income'>Income</option>
                        <option value='health'>Health</option>
                        <option value='transport'>Transport</option>
                        <option value='income'>Income</option>
                    </select>
                </div>
                <div className='add-expense-notes-container'>
                    <label htmlFor="notes">Notes (Optional)</label>
                    <textarea type="text" name="notes" id='notes-input'/>
                </div>
                <div className='add-expense-buttons-container'>
                    <button id='cancel-transaction-button'>Cancel</button>
                    <button id='add-transaction-button'>Add Transaction</button>
                </div>
            </div>
        </div>
    ) : null;
};

export default AddExpenseModal;