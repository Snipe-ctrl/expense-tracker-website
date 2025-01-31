import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../context/AuthContext";
import { useTransactions } from '../context/TransactionsContext';

const RecentTransactionsCard = ({ onAddExpense }) => {

    const { user, loading } = useContext(AuthContext);
    const { transactions, transactionsLoading, getTransactions } = useTransactions();

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(dateString));
    };

    useEffect(() => {
        if (!loading && user)
            getTransactions();
    }, [loading, user])

    return (
        <div className='recent-transactions-container'>
            <div className='recent-transactions-card'>
                <div className='recent-transactions-header'>
                    <h2>Recent Transactions</h2>
                    <div className='actions'>
                        <button className='filter-button'>
                            <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.05974 1.25117C1.24021 0.868359 1.62303 0.625 2.04685 0.625H13.8594C14.2832 0.625 
                                14.666 0.868359 14.8465 1.25117C15.0269 1.63398 14.9722 2.08516 14.7043 2.41328L9.7031 8.52461V12C9.7031 
                                12.3309 9.51717 12.6344 9.21912 12.782C8.92107 12.9297 8.56834 12.8996 8.3031 12.7L6.5531 11.3875C6.33162 
                                11.2234 6.2031 10.9637 6.2031 10.6875V8.52461L1.1992 2.41055C0.933964 2.08516 0.876542 1.63125 1.05974 1.25117Z" fill="#4B5563"/>
                            </svg>
                            Filter
                        </button>
                        <button className='add-new-button' onClick={() => onAddExpense(getTransactions)}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.09375 0.9375C7.09375 0.453516 6.70273 0.0625 6.21875 0.0625C5.73477 0.0625 5.34375 
                                0.453516 5.34375 0.9375V4.875H1.40625C0.922266 4.875 0.53125 5.26602 0.53125 5.75C0.53125 6.23398 
                                0.922266 6.625 1.40625 6.625H5.34375V10.5625C5.34375 11.0465 5.73477 11.4375 6.21875 11.4375C6.70273 
                                11.4375 7.09375 11.0465 7.09375 10.5625V6.625H11.0312C11.5152 6.625 11.9062 6.23398 11.9062 5.75C11.9062 
                                5.26602 11.5152 4.875 11.0312 4.875H7.09375V0.9375Z" fill="white"/>
                            </svg>
                            Add New
                        </button>
                    </div>
                </div>
                <div className='transactions-table'>
                    <div className='recent-transactions-table-header'>
                        <p>Date</p>
                        <p>Description</p>
                        <p>Category</p>
                        <p>Amount</p>
                    </div>
                    {transactionsLoading ? (
                        <p>Loading...</p>
                    ) : (
                    transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <div key={transaction.id} className='recent-transactions-row'>
                                <p className='recent-transactions-date'>{formatDate(transaction.date)}</p>
                                <p className='recent-transactions-description'>{transaction.description}</p>
                                <p className={`recent-transactions-category ${transaction.category.toLowerCase()}`}>{transaction.category}</p>
                                <p className={`recent-transactions-amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                                    {transaction.amount >= 0 ? `+${transaction.amount}` : transaction.amount}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No recent transactions found</p>
                    ))}
                </div>
                <div className='view-more-transactions-container'>
                    <button>
                        View More Transactions
                        <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_107_372)">
                            <path d="M8.68057 6.38213C9.02236 6.72393 9.02236 7.279 8.68057 7.6208L3.43057 12.8708C3.08877 13.2126 
                            2.53369 13.2126 2.19189 12.8708C1.8501 12.529 1.8501 11.9739 2.19189 11.6321L6.82393 7.0001L2.19463 
                            2.36807C1.85283 2.02627 1.85283 1.47119 2.19463 1.12939C2.53643 0.787598 3.0915 0.787598 3.4333 
                            1.12939L8.6833 6.3794L8.68057 6.38213Z" fill="#4B5563"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_107_372">
                            <path d="M0.1875 0H8.9375V14H0.1875V0Z" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RecentTransactionsCard;