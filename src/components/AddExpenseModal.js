import React, { useContext, useState, useEffect } from 'react';
import apiFetch from '../utils/apiFetch';

const AddExpenseModal = ({ onClose, onExpenseAdded, editingTransaction }) => {

    // sets default state for new expense form
    const [newExpense, setNewExpense] = useState({
        date: '',
        description: '',
        category: 'Food',
        amount: '',
        notes: '',
    });

    useEffect(() => {
        if (editingTransaction) {

            const formattedAmount = Math.abs(editingTransaction.amount);

            const formattedDate = new Date(editingTransaction.date)
            .toISOString()
            .split('T')[0];

            setNewExpense({
                date: formattedDate,
                description: editingTransaction.description,
                category: editingTransaction.category,
                amount: formattedAmount,
                notes: editingTransaction.notes,
            });
        }
    }, [editingTransaction])

    // handles new expense form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // makes expenses negative and income positive
        let adjustedAmount = newExpense.amount;

        if (['Food', 'Transport', 'Health', 'Entertainment', 'Education', 'Programming', 'Clothing'].includes(newExpense.category)) {
            adjustedAmount = Math.abs(parseFloat(newExpense.amount)) * -1;
        } else {
            adjustedAmount = Math.abs(parseFloat(newExpense.amount));
        }

        // expenses for API
        const payload = {
            date: newExpense.date,
            description: newExpense.description,
            category: newExpense.category,
            amount: adjustedAmount.toFixed(2),
            notes: newExpense.notes,
        };

        let response;
        try {
            if (editingTransaction) {
                response = await apiFetch(`edit-expense/${editingTransaction.id}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                });
            } else {
                response = await apiFetch('add-expense', {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
            }
            
                    // checks if response was valid and resets new expense form
            if (response) {
                console.log(`${editingTransaction ? 'Expense updated' : 'Expense added'} succesfully:`, response);
                onClose();
                setNewExpense({ date: '', description: '', category: 'Food', amount: '0.00', notes: '' });
                onExpenseAdded();
            } else {
                console.error(`Failed to ${editingTransaction ? 'update expense' : 'add expense'}`);
            }
        } catch (err) {
            console.error('An error occurred: ', err);
        }
    };

    return (
        <div className='overlay'>
            <div className='add-expense-container'>
                <div className='add-expense-header'>
                    <h2>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
                    <svg onClick={onClose} width="12" height="13" className="x" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.5445 2.79448C11.984 2.35503 11.984 1.64136 11.5445 1.2019C11.1051 0.762451 10.3914 
                        0.762451 9.95197 1.2019L6.25001 4.90737L2.54454 1.20542C2.10509 0.765967 1.39142 0.765967 0.951965 
                        1.20542C0.512512 1.64487 0.512512 2.35854 0.951965 2.798L4.65743 6.49995L0.955481 10.2054C0.516028 
                        10.6449 0.516028 11.3585 0.955481 11.798C1.39493 12.2375 2.10861 12.2375 2.54806 11.798L6.25001 
                        8.09253L9.95548 11.7945C10.3949 12.2339 11.1086 12.2339 11.5481 11.7945C11.9875 11.355 11.9875 
                        10.6414 11.5481 10.2019L7.84259 6.49995L11.5445 2.79448Z" fill="#6B7280"/>
                    </svg>
                </div>
            <form onSubmit={handleSubmit}>
                <div className="add-expense-description-container">
                    <label htmlFor="description">Description</label>
                    <input 
                        type="text" 
                        name="description"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    />
                </div>
                <div className='add-expense-amount-date-container'>
                    <div className='add-expense-amount-container'>
                        <label htmlFor="amount">Amount</label>
                        <div className='amount-input-wrapper'>
                            <p className='currency-symbol'>$</p>
                            <input 
                                type="number" 
                                name="amount" 
                                value={newExpense.amount}
                                id='expense-amount'
                                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                min='0'
                                step='0.01'
                                placeholder='0.00'
                                required
                            />
                        </div>
                    </div>
                    <div className='add-expense-date-container'>
                        <label htmlFor="date">Date</label>
                        <input 
                            type="date" 
                            name="date" 
                            value={newExpense.date}
                            id='expense-date'
                            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className='add-expense-category-container'>
                    <label htmlFor="category">Category</label>
                    <select 
                        name='category' 
                        id='category'
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    >
                        <option value='Food'>Food</option>
                        <option value='Entertainment'>Entertainment</option>
                        <option value='Income'>Income</option>
                        <option value='Health'>Health</option>
                        <option value='Transport'>Transport</option>
                        <option value='Education'>Education</option>
                        <option value='Programming'>Programming</option>
                        <option value='Clothing'>Clothing</option>
                    </select>
                </div>
                <div className='add-expense-notes-container'>
                    <label htmlFor="notes">Notes (Optional)</label>
                    <textarea 
                        type="text" 
                        name="notes" 
                        id='notes-input'
                        value={newExpense.notes}
                        onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                    />
                </div>
                <div className='add-expense-buttons-container'>
                    <button 
                        id='cancel-transaction-button' 
                        type='button'
                        onClick={(e) => {
                            e.preventDefault;
                            onClose();
                        }}
                    >
                        Cancel
                    </button>
                    <button type='submit' id='add-transaction-button'>{editingTransaction ? 'Update Transaction' : 'Add Transaction'}</button>
                </div>
            </form>
            </div>
        </div>
    )
};

export default AddExpenseModal;