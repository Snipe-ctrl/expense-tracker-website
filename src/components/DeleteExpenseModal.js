import React, { useContext, useState, useEffect } from 'react';
import apiFetch from '../utils/apiFetch';

const DeleteExpenseModal = ({ expenseId, onClose, onDeleteSuccess }) => {

    const handleDelete = async (event) => {
        event.preventDefault();

        const payload = {
            expenseId: expenseId
        };

        console.log(expenseId);

        try {

            const response = await apiFetch('delete-expense', {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (response) {
                onDeleteSuccess();
                onClose();
            } else {
                console.error('Failed to delete expense:', response?.statusText || 'No response from server');
            }
        } catch (err) {
            console.error('Error: ', err);
        }
    }

    return (
        <div className='overlay'>
            <div className='delete-expense-container'>
                <h2>Delete Expense</h2>
                <p>Are you sure you want to delete this 
                    expense? This action cannot be undone.</p>
                <div className='delete-expense-buttons'>
                    <button onClick={onClose} id='delete-expense-cancel-button'>Cancel</button>
                    <button onClick={handleDelete} id='delete-expense-delete-button'>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteExpenseModal;