import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { useTransactions } from '../../context/TransactionsContext';

const TransactionsCard = ({
    isDashboard,
    onAddExpense, 
    onDeleteExpense, 
    onEditExpense 
}) => {

    // context for user and transactions
    const { user, loading } = useContext(AuthContext);
    const { transactions, transactionsLoading, getTransactions } = useTransactions();

    // current month
    const today = new Date();
    const currentYear = today.getFullYear();

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const monthDropdownRef = useRef(null);
    const yearDropdownRef = useRef(null);

    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1)
    .toISOString()
    .split('T')[0];

    const handleMonthSelect = (index) => {
        setSelectedMonth(index);
        setTimeout(() => setIsMonthDropdownOpen(false), 0);
    };
    const handleYearSelect = (year) => {
        setSelectedYear(year);
        setTimeout(() => setIsYearDropdownOpen(false), 0);
    };
    
    // handles amount of transactions displayed
    const displayedTransactions = isDashboard ? transactions.slice(0, 10) : transactions;

    // states and ref for transaction dropdown menu
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const transactionDropdownRef = useRef(null);

    // handles formatting date
    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(dateString));
    };

    // allows user to click outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (transactionDropdownRef.current && !transactionDropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
            if (
                monthDropdownRef.current &&
                !monthDropdownRef.current.contains(event.target)
            ) {
                setIsMonthDropdownOpen(false);
            }
            if (
                yearDropdownRef.current &&
                !yearDropdownRef.current.contains(event.target)
            ) {
                setIsYearDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // updates stats when user or data changes
    useEffect(() => {
        if (!loading && user) {
            if (isDashboard) {
                getTransactions(firstDayOfMonth);
            } else {
                getTransactions(firstDayOfMonth);
            }
        }
    }, [loading, user, isDashboard]);

    return (
        <div className='recent-transactions-container'>
            <div className='recent-transactions-card'>
                <div className='recent-transactions-header'>
                    <h2>Recent Transactions</h2>
                    <div className='actions'>
                        <div className='date-dropdown month-dropdown' ref={monthDropdownRef} onClick={() => setIsMonthDropdownOpen(prev => !prev)}>
                            <p className='date-text'>{months[selectedMonth]}</p>
                            <svg className='date-arrow-svg' width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.31951 7.11807C6.6613 7.45986 7.21638 7.45986 7.55818 7.11807L12.8082 1.86807C13.15 
                                1.52627 13.15 0.971191 12.8082 0.629395C12.4664 0.287598 11.9113 0.287598 11.5695 0.629395L6.93748 
                                5.26143L2.30544 0.632129C1.96365 0.290332 1.40857 0.290332 1.06677 0.632129C0.724976 0.973925 
                                0.724976 1.529 1.06677 1.8708L6.31677 7.1208L6.31951 7.11807Z" fill="#374151"/>
                            </svg>
                            {isMonthDropdownOpen && (
                                <div className='date-dropdown-item-container month-dropdown-item-container'>
                                    {months.map((month, index) => (
                                        <div className='date-dropdown-item' key={index} onClick={() => handleMonthSelect(index)}>
                                        {index === selectedMonth && (
                                            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12.9306 0.881836C13.2724 1.22363 13.2724 1.77871 12.9306 2.12051L5.93057 9.12051C5.58877 
                                                9.46231 5.03369 9.46231 4.69189 9.12051L1.19189 5.62051C0.850098 5.27871 0.850098 4.72363 1.19189 
                                                4.38184C1.53369 4.04004 2.08877 4.04004 2.43057 4.38184L5.3126 7.26113L11.6946 0.881836C12.0364 
                                                0.540039 12.5915 0.540039 12.9333 0.881836H12.9306Z" fill="#6B7280"/>
                                            </svg>)}
                                        <p>{month}</p>
                                    </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className='date-dropdown year-dropdown' ref={yearDropdownRef} onClick={() => setIsYearDropdownOpen(prev => !prev)}>
                            <p className='date-text'>{selectedYear}</p>
                            <svg className='date-arrow-svg' width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.31951 7.11807C6.6613 7.45986 7.21638 7.45986 7.55818 7.11807L12.8082 1.86807C13.15 
                                1.52627 13.15 0.971191 12.8082 0.629395C12.4664 0.287598 11.9113 0.287598 11.5695 0.629395L6.93748 
                                5.26143L2.30544 0.632129C1.96365 0.290332 1.40857 0.290332 1.06677 0.632129C0.724976 0.973925 
                                0.724976 1.529 1.06677 1.8708L6.31677 7.1208L6.31951 7.11807Z" fill="#374151"/>
                            </svg>
                            {isYearDropdownOpen && (
                                <div className='date-dropdown-item-container year-dropdown-item-container'>
                                    {years.map((year, index) => (
                                        <div className='date-dropdown-item' key={index} onClick={() => handleYearSelect(year)}>
                                            {year === selectedYear && (
                                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12.9306 0.881836C13.2724 1.22363 13.2724 1.77871 12.9306 2.12051L5.93057 9.12051C5.58877 
                                                    9.46231 5.03369 9.46231 4.69189 9.12051L1.19189 5.62051C0.850098 5.27871 0.850098 4.72363 1.19189 
                                                    4.38184C1.53369 4.04004 2.08877 4.04004 2.43057 4.38184L5.3126 7.26113L11.6946 0.881836C12.0364 
                                                    0.540039 12.5915 0.540039 12.9333 0.881836H12.9306Z" fill="#6B7280"/>
                                                </svg>)}
                                            <p>{year}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className='add-new-button' onClick={onAddExpense}>
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
                        <p></p>
                        <p>Date</p>
                        <p>Description</p>
                        <p>Category</p>
                        <p>Amount</p>
                        <p>Notes</p>
                    </div>
                    {transactionsLoading ? (
                        <p>Loading...</p>
                    ) : (
                    displayedTransactions.length > 0 ? (
                        displayedTransactions.map((transaction) => (
                            <div key={transaction.id} className='recent-transactions-row'>
                                <div className='dots-container'>
                                    <svg className='dots-svg' width="12" height="12" viewBox="0 0 4 12" fill="none" xmlns="http://www.w3.org/2000/svg" overflow='visible'
                                    onClick={() => setOpenDropdownId(openDropdownId === transaction.id ? null : transaction.id)}>
                                        <circle className="dots-bg" cx="2" cy="6" r="15" fill="#F3F4F6" opacity="0" />
                                        <path d="M1.71875 8.84375C1.31264 8.84375 0.923158 9.00508 0.635993 9.29224C0.348828 9.57941 
                                        0.1875 9.96889 0.1875 10.375C0.1875 10.7811 0.348828 11.1706 0.635993 11.4578C0.923158 11.7449 
                                        1.31264 11.9062 1.71875 11.9062C2.12486 11.9063 2.51434 11.7449 2.80151 11.4578C3.08867 11.1706 
                                        3.25 10.7811 3.25 10.375C3.25 9.96889 3.08867 9.57941 2.80151 9.29224C2.51434 9.00508 2.12486 
                                        8.84375 1.71875 8.84375ZM1.71875 4.46875C1.31264 4.46875 0.923158 4.63008 0.635993 4.91724C0.348828 
                                        5.20441 0.1875 5.59389 0.1875 6C0.1875 6.40611 0.348828 6.79559 0.635993 7.08276C0.923158 7.36992 
                                        1.31264 7.53125 1.71875 7.53125C2.12486 7.53125 2.51434 7.36992 2.80151 7.08276C3.08867 6.79559 3.25 
                                        6.40611 3.25 6C3.25 5.59389 3.08867 5.20441 2.80151 4.91724C2.51434 4.63008 2.12486 4.46875 1.71875 
                                        4.46875ZM3.25 1.625C3.25 1.21889 3.08867 0.829408 2.80151 0.542243C2.51434 0.255078 2.12486 0.09375 
                                        1.71875 0.09375C1.31264 0.09375 0.923158 0.255078 0.635993 0.542243C0.348828 0.829408 0.1875 1.21889 
                                        0.1875 1.625C0.1875 2.03111 0.348828 2.42059 0.635993 2.70776C0.923158 2.99492 1.31264 3.15625 1.71875 
                                        3.15625C2.12486 3.15625 2.51434 2.99492 2.80151 2.70776C3.08867 2.42059 3.25 2.03111 3.25 1.625Z" fill="#9CA3AF"/>
                                    </svg>
                                    {openDropdownId === transaction.id && (
                                    <div 
                                        className='transaction-dropdown-container'
                                        ref={transactionDropdownRef}
                                    >
                                        <div 
                                            className='transaction-dropdown-item edit-transaction-dropdown-item'
                                            onClick={() => onEditExpense(transaction)}
                                        >
                                            <svg className='edit-svg' width="15" height="14" viewBox="0 0 15 14" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.2547 0.593164C12.6559 -0.00566407 11.6879 -0.00566407 11.0891 0.593164L10.266 1.41348L12.943 
                                                4.09043L13.766 3.26738C14.3648 2.66855 14.3648 1.70059 13.766 1.10176L13.2547 0.593164ZM5.07344 
                                                6.60879C4.90664 6.77559 4.77812 6.98066 4.7043 7.20762L3.89492 9.63574C3.81562 9.8709 3.87852 
                                                10.1307 4.05352 10.3084C4.22852 10.4861 4.48828 10.5463 4.72617 10.467L7.1543 9.65762C7.37852 
                                                9.58379 7.58359 9.45527 7.75312 9.28848L12.3277 4.71113L9.64805 2.03145L5.07344 6.60879ZM2.98437 
                                                1.7498C1.53516 1.7498 0.359375 2.92559 0.359375 4.3748V11.3748C0.359375 12.824 1.53516 13.9998 
                                                2.98437 13.9998H9.98437C11.4336 13.9998 12.6094 12.824 12.6094 11.3748V8.7498C12.6094 8.26582 
                                                12.2184 7.8748 11.7344 7.8748C11.2504 7.8748 10.8594 8.26582 10.8594 8.7498V11.3748C10.8594 
                                                11.8588 10.4684 12.2498 9.98437 12.2498H2.98437C2.50039 12.2498 2.10937 11.8588 2.10937 
                                                11.3748V4.3748C2.10937 3.89082 2.50039 3.4998 2.98437 3.4998H5.60937C6.09336 3.4998 6.48437 
                                                3.10879 6.48437 2.6248C6.48437 2.14082 6.09336 1.7498 5.60937 1.7498H2.98437Z"/>
                                            </svg>
                                            <p className='edit-transaction-button'>Edit</p>
                                        </div>
                                        <div 
                                            className='transaction-dropdown-item delete-transaction-dropdown-item'
                                            onClick={() => onDeleteExpense(transaction.id)}
                                        >
                                            <svg className='trash-svg' width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_131_361)">
                                                <path d="M4.61875 0.483984L4.42188 0.875H1.79688C1.31289 0.875 0.921875 1.26602 0.921875 
                                                1.75C0.921875 2.23398 1.31289 2.625 1.79688 2.625H12.2969C12.7809 2.625 13.1719 2.23398 13.1719 1.75C13.1719 
                                                1.26602 12.7809 0.875 12.2969 0.875H9.67188L9.475 0.483984C9.32734 0.185938 9.02383 0 8.69297 0H5.40078C5.06992 
                                                0 4.76641 0.185938 4.61875 0.483984ZM12.2969 3.5H1.79688L2.37656 12.7695C2.42031 13.4613 2.99453 14 3.68633 
                                                14H10.4074C11.0992 14 11.6734 13.4613 11.7172 12.7695L12.2969 3.5Z"/>
                                                </g>
                                                <defs>
                                                <clipPath id="clip0_131_361">
                                                <path d="M0.921875 0H13.1719V14H0.921875V0Z" fill="white"/>
                                                </clipPath>
                                                </defs>
                                            </svg>
                                            <p className='delete-transaction-button'>Delete</p>
                                        </div>
                                    </div>
                                    )}
                                </div>
                                <p className='recent-transactions-date'>{formatDate(transaction.date)}</p>
                                <p className='recent-transactions-description'>{transaction.description}</p>
                                <p className={`recent-transactions-category ${transaction.category.toLowerCase()}`}>{transaction.category}</p>
                                <p className={`recent-transactions-amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                                    {transaction.amount >= 0 ? `+${transaction.amount}` : transaction.amount}
                                </p>
                                <p className='recent-transactions-notes'>{transaction.notes ? transaction.notes : '-'}</p>
                            </div>
                        ))
                    ) : (
                        <p>No recent transactions found</p>
                    ))}
                </div>
                {isDashboard ? (
                <div className='view-more-transactions-container'>
                    <button>
                        View More Transactions
                        <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_107_372)">
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
                ) : (
                    <div>Filler</div>
                )}
            </div>
        </div>
    )
}

export default TransactionsCard;