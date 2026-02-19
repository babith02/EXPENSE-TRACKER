import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/globalContext';
import { dateFormat } from '../utils/dateFormat';

function History() {
    const {transactionHistory} = useGlobalContext()

    const [...history] = transactionHistory()

    const getCategoryLabel = (category) => {
        const labels = {
            education: 'Education',
            groceries: 'Groceries',
            health: 'Health',
            subscriptions: 'Subscriptions',
            takeaways: 'Takeaways',
            clothing: 'Clothing',
            travelling: 'Travelling',
            salary: 'Salary',
            freelancing: 'Freelancing',
            investments: 'Investments',
            stocks: 'Stocks',
            bitcoin: 'Bitcoin',
            bank: 'Bank',
            youtube: 'YouTube',
            other: 'Other'
        }
        return labels[category] || category?.charAt(0).toUpperCase() + category?.slice(1) || 'Unknown'
    }

    return (
        <HistoryStyled>
            <h2>Recent History</h2>
            {history.length === 0 ? (
                <div className="no-history">No recent transactions</div>
            ) : (
                history.map((item) =>{
                    const {_id, title, amount, type, category, date} = item
                    return (
                        <div key={_id} className={`history-item ${type}`}>
                            <div className="item-left">
                                <div className={`type-indicator ${type}`}></div>
                                <div className="item-details">
                                    <p className="item-title" style={{
                                        color: type === 'expense' ? 'var(--color-delete)' : 'var(--color-green)'
                                    }}>
                                        {title}
                                    </p>
                                    <span className="item-meta">
                                        {getCategoryLabel(category)} • {dateFormat(date)}
                                    </span>
                                </div>
                            </div>
                            <p className="item-amount" style={{
                                color: type === 'expense' ? 'var(--color-delete)' : 'var(--color-green)'
                            }}>
                                {type === 'expense' ? `-$${amount <= 0 ? 0 : amount}` : `+$${amount <= 0 ? 0: amount}`}
                            </p>
                        </div>
                    )
                })
            )}
        </HistoryStyled>
    )
}

const HistoryStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    h2 {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
    }
    
    .no-history {
        text-align: center;
        padding: 1.5rem;
        color: rgba(34, 34, 96, 0.5);
        font-style: italic;
        background: #FCF6F9;
        border-radius: 20px;
    }
    
    .history-item {
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        padding: 1rem;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        
        &:hover {
            transform: translateX(5px);
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        &.income {
            border-left: 4px solid var(--color-green);
        }
        
        &.expense {
            border-left: 4px solid var(--color-delete);
        }
        
        .item-left {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            
            .type-indicator {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                
                &.income {
                    background: var(--color-green);
                }
                &.expense {
                    background: var(--color-delete);
                }
            }
            
            .item-details {
                display: flex;
                flex-direction: column;
                
                .item-title {
                    font-weight: 600;
                    font-size: 1rem;
                }
                
                .item-meta {
                    font-size: 0.75rem;
                    color: rgba(34, 34, 96, 0.5);
                    margin-top: 0.2rem;
                }
            }
        }
        
        .item-amount {
            font-weight: 700;
            font-size: 1.1rem;
        }
    }
`;

export default History