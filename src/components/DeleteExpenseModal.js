import React, { useContext, useState, useEffect } from 'react';

const DeleteExpenseModal = ({ onClose }) => {
    return (
        <div className='overlay'>
            <div className='delete-expense-container'>
                <h2>Delete Expense</h2>
                <p>Are you sure you want to delete this 
                    expense? This action cannot be undone.</p>
                <div className='delete-expense-buttons'>
                    <button onClick={onClose} id='delete-expense-cancel-button'>Cancel</button>
                    <button id='delete-expense-delete-button'>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteExpenseModal;