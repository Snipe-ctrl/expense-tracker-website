import React, { useContext, useEffect, useState } from 'react';
import { useTransactions } from '../../context/TransactionsContext';

const OverviewCards = () => {

    // gets transaction data from context
    const { transactions, transactionsLoading } = useTransactions();

    // sets defualt values for overview cards
    const [cardValues, setCardValues] = useState({
        thisMonthIncome: 0,
        thisMonthExpenses: 0,
        remainingBalance: 0,
        incomePercentage: 0,
        totalExpensesPercentage: 0,
        lastMonthIncome: 0,
        lastMonthExpenses: 0,
    })

    // handles setting overview card data
    const calculateCardValues = () => {

        // gets this months date
        const today = new Date();
        const currentYear = today.getFullYear();

        // gets last months date
        const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthYear = lastMonthDate.getFullYear();

        // handles parsing expense date
        const parseTransactionDate = (dateString) => {
            return new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00Z`);
        };        

        // contains this months expense data
        const thisMonthTransactions = transactions.filter((transaction) => {
            const transactionDate = parseTransactionDate(transaction.date);
            return (
                transactionDate.getFullYear() === currentYear &&
                transactionDate.getMonth() ===  today.getMonth()
            );
        });

        // contains last months expense data
        const lastMonthTransactions = transactions.filter((transaction) => {
            const transactionDate = parseTransactionDate(transaction.date);
            return (
                transactionDate.getFullYear() === lastMonthYear &&
                transactionDate.getMonth() === lastMonthDate.getMonth()
            );
        });

        // initializes expense and income variables
        let thisMonthExpenses = 0;
        let thisMonthIncome = 0;

        // calculates this months total income and expenses
        thisMonthTransactions.forEach((transaction) => {
            let amount = Number(transaction.amount)
            if (amount < 0) {
                thisMonthExpenses += Math.abs(amount);
            } else {
                thisMonthIncome += amount;
            }
        });

        // calculates this months remaining balance
        let remainingBalance = thisMonthIncome - thisMonthExpenses;

        // initializes last months income and expense variables
        let lastMonthIncome = 0;
        let lastMonthExpenses = 0;
        
        // calculates last months total expenses and income
        lastMonthTransactions.forEach((transaction) => {
            let amount = Number(transaction.amount)
            if (amount < 0) {
                lastMonthExpenses += Math.abs(amount);
            } else {
                lastMonthIncome += amount;
            }
        });

        // calculates income percentage and expenses percentage
        const incomePercentage = lastMonthIncome > 0 
        ? Math.round(((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100)
        : (thisMonthIncome > 0 ? 100 : 0);
    
        const totalExpensesPercentage = lastMonthExpenses > 0
        ? Math.round(((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100)
        : (thisMonthExpenses > 0 ? 100 : 0);

        // updates overview card variables
        setCardValues({
            thisMonthIncome,
            thisMonthExpenses,
            remainingBalance,
            incomePercentage,
            totalExpensesPercentage,
            lastMonthIncome,
            lastMonthExpenses,
        });
    };

    useEffect(() => {
        if (!transactionsLoading) {
            calculateCardValues();
        }
    }, [transactions, transactionsLoading]);

    return (
        <div className='overview-cards-container'>
            <div className='overview-card' id='total-income-card-container'>
                <div className='overview-card-heading'>
                    <h3>Total Income</h3>
                    <svg
                    width="36"
                    height="32"
                    viewBox="0 0 36 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4.5 0.25C2.01797 0.25 0 2.26797 0 4.75V27.25C0 29.732 2.01797 31.75 4.5 31.75H31.5C33.982 
                            31.75 36 29.732 36 27.25V11.5C36 9.01797 33.982 7 31.5 7H5.625C5.00625 7 4.5 6.49375 4.5 5.875C4.5 5.25625 
                            5.00625 4.75 5.625 4.75H31.5C32.7445 4.75 33.75 3.74453 33.75 2.5C33.75 1.25547 32.7445 0.25 31.5 0.25H4.5ZM29.25 
                            17.125C29.8467 17.125 30.419 17.3621 30.841 17.784C31.2629 18.206 31.5 18.7783 31.5 19.375C31.5 19.9717 31.2629 20.544 
                            30.841 20.966C30.419 21.3879 29.8467 21.625 29.25 21.625C28.6533 21.625 28.081 21.3879 27.659 20.966C27.2371 20.544 27 
                            19.9717 27 19.375C27 18.7783 27.2371 18.206 27.659 17.784C28.081 17.3621 28.6533 17.125 29.25 17.125Z"
                        fill="#2563EB"
                    />
                    </svg>
                </div>
                <h2>{cardValues.thisMonthIncome > 0 ? `$${cardValues.thisMonthIncome.toFixed(2)}` : '$0.00'}</h2>
                <div className='overview-card-bottom'>
                    <svg 
                        className={`arrow-svg ${cardValues.incomePercentage > 0 ?
                             'up-arrow green-arrow' :
                            'down-arrow red-arrow'}`}
                        width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.86794 0.882034C5.52615 0.540237 4.97107 0.540237 4.62927 0.882034L0.254272 5.25703C-0.0875244 
                        5.59883 -0.0875244 6.15391 0.254272 6.49571C0.596069 6.8375 1.15115 6.8375 1.49294 6.49571L4.37498 
                        3.61094V12C4.37498 12.484 4.76599 12.875 5.24998 12.875C5.73396 12.875 6.12498 12.484 6.12498 12V3.61094L9.00701 
                        6.49297C9.3488 6.83477 9.90388 6.83477 10.2457 6.49297C10.5875 6.15118 10.5875 5.5961 10.2457 5.2543L5.87068 0.8793L5.86794 0.882034Z" fill="#059669"/>
                    </svg> 
                    <p 
                        className={cardValues.incomePercentage > 0 ? 'positive-text' : 'negative-text'}>
                        {cardValues.incomePercentage > 0 ? cardValues.incomePercentage : cardValues.incomePercentage * -1}
                        % from last month
                    </p>
                </div>
            </div>
            <div className='overview-card' id='total-expenses-card-container'>
            <div className='overview-card-heading'>
                    <h3>Total Expenses</h3>
                    <svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.32812 0C1.225 0 0.328125 0.896875 0.328125 2V3H18.3281V2C18.3281 0.896875 17.4312 0 
                        16.3281 0H2.32812ZM18.3281 6H0.328125V12C0.328125 13.1031 1.225 14 2.32812 14H16.3281C17.4312 14 
                        18.3281 13.1031 18.3281 12V6ZM3.82812 10H5.82812C6.10313 10 6.32812 10.225 6.32812 10.5C6.32812 
                        10.775 6.10313 11 5.82812 11H3.82812C3.55312 11 3.32812 10.775 3.32812 10.5C3.32812 10.225 3.55312 
                        10 3.82812 10ZM7.32812 10.5C7.32812 10.225 7.55312 10 7.82812 10H11.8281C12.1031 10 12.3281 10.225
                        12.3281 10.5C12.3281 10.775 12.1031 11 11.8281 11H7.82812C7.55312 11 7.32812 10.775 7.32812 10.5Z" fill="#DC2626"/>
                    </svg>

                </div>
                <h2>{cardValues.thisMonthExpenses > 0 ? `$${cardValues.thisMonthExpenses.toFixed(2)}` : '$0.00'}</h2>
                <div className='overview-card-bottom'>
                    <svg 
                        className={`arrow-svg ${cardValues.totalExpensesPercentage > 0 ?
                            'up-arrow green-arrow' :
                            'down-arrow red-arrow'}`} width="11" height="13" viewBox="0 0 11 13" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.86794 0.882034C5.52615 0.540237 4.97107 0.540237 4.62927 0.882034L0.254272 5.25703C-0.0875244 
                        5.59883 -0.0875244 6.15391 0.254272 6.49571C0.596069 6.8375 1.15115 6.8375 1.49294 6.49571L4.37498 
                        3.61094V12C4.37498 12.484 4.76599 12.875 5.24998 12.875C5.73396 12.875 6.12498 12.484 6.12498 12V3.61094L9.00701 
                        6.49297C9.3488 6.83477 9.90388 6.83477 10.2457 6.49297C10.5875 6.15118 10.5875 5.5961 10.2457 5.2543L5.87068 0.8793L5.86794 0.882034Z"/>
                    </svg>
                    <p 
                        className={cardValues.totalExpensesPercentage > 0 ? 'positive-text' : 'negative-text'}>
                        {cardValues.totalExpensesPercentage > 0 ? cardValues.totalExpensesPercentage : cardValues.totalExpensesPercentage * -1}
                        % from last month</p>
                </div>
            </div>
            <div className='overview-card' id='remaining-balance-card-container'>
            <div className='overview-card-heading'>
                    <h3>Remaining Balance</h3>
                    <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.4844 3V3.02187C13.3188 3.00937 13.1531 3 12.9844 3H8.98438C8.46875 3 7.96875 3.06562 
                        7.49062 3.1875C7.4875 3.125 7.48438 3.0625 7.48438 3C7.48438 1.34375 8.82812 0 10.4844 0C12.1406 
                        0 13.4844 1.34375 13.4844 3ZM12.9844 4C13.0938 4 13.2031 4.00313 13.3094 4.00938C13.4406 4.01875 
                        13.5719 4.03125 13.7031 4.05C14.2531 3.40938 15.0719 3 15.9844 3H16.3438C16.6687 3 16.9062 3.30625 
                        16.8281 3.62188L16.3969 5.34688C16.8906 5.80938 17.2938 6.37187 17.5688 7H17.9844C18.5375 7 18.9844 
                        7.44688 18.9844 8V11C18.9844 11.5531 18.5375 12 17.9844 12H16.9844C16.7 12.3781 16.3625 12.7156 
                        15.9844 13V15C15.9844 15.5531 15.5375 16 14.9844 16H13.9844C13.4312 16 12.9844 15.5531 12.9844 
                        15V14H8.98438V15C8.98438 15.5531 8.5375 16 7.98438 16H6.98438C6.43125 16 5.98438 15.5531 5.98438 
                        15V13C4.89375 12.1812 4.15 10.9281 4.00938 9.5H3.10938C1.93438 9.5 0.984375 8.55 0.984375 7.375C0.984375 
                        6.2 1.93438 5.25 3.10938 5.25H3.23438C3.65 5.25 3.98438 5.58437 3.98438 6C3.98438 6.41563 3.65 6.75 
                        3.23438 6.75H3.10938C2.76562 6.75 2.48438 7.03125 2.48438 7.375C2.48438 7.71875 2.76562 8 3.10938 
                        8H4.08437C4.4625 6.13125 5.8875 4.64062 7.71875 4.1625C8.12187 4.05625 8.54688 4 8.98438 
                        4H12.9844ZM14.9844 8.25C14.9844 8.05109 14.9054 7.86032 14.7647 7.71967C14.6241 7.57902 14.4333 
                        7.5 14.2344 7.5C14.0355 7.5 13.8447 7.57902 13.704 7.71967C13.5634 7.86032 13.4844 8.05109 13.4844 
                        8.25C13.4844 8.44891 13.5634 8.63968 13.704 8.78033C13.8447 8.92098 14.0355 9 14.2344 9C14.4333 9 14.6241 
                        8.92098 14.7647 8.78033C14.9054 8.63968 14.9844 8.44891 14.9844 8.25Z" fill="#059669"/>
                    </svg>
                </div>
                <h2>{cardValues.remainingBalance > 0 ? `$${cardValues.remainingBalance.toFixed(2)}` : '$0.00'}</h2>
                <div className='overview-card-bottom'>
                    <p className='default-text'>Available to spend</p>
                </div>
            </div>
        </div>
    )
};

export default OverviewCards;