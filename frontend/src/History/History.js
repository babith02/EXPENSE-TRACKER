import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/globalContext';
import { dateFormat } from '../utils/dateFormat';

function History() {
    const {transactionHistory} = useGlobalContext()

    const [...history] = transactionHistory()

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount)
    }

    return (
        <HistoryStyled>
            <h2>Recent Transactions</h2>
            {history.length > 0 ? (
                history.map((item) =>{
                    const {_id, title, amount, type, date, category} = item
                    return (
                        <div key={_id} className={`history-item ${type}`}>
                            <div className="item-left">
                                <span className={`indicator ${type}`}></span>
                                <div className="item-details">
                                    <p className="item-title">{title}</p>
                                    <span className="item-meta">
                                        {category && <span className="category">{category}</span>}
                                        {date && <span className="date">{dateFormat(date)}</span>}
                                    </span>
                                </div>
                            </div>
                            <p className={`item-amount ${type}`}>
                                {type === 'expense' ? '-' : '+'}${formatCurrency(amount <= 0 ? 0 : amount)}
                            </p>
                        </div>
                    )
                })
            ) : (
                <p className="no-history">No recent transactions</p>
            )}
        </HistoryStyled>
    )
}

const HistoryStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;

    h2 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        color: var(--primary-color);
    }

    .history-item {
        background: white;
        border: 1px solid rgba(34, 34, 96, 0.1);
        padding: 0.8rem 1rem;
        border-radius: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease;

        &:hover {
            transform: translateX(3px);
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
        }

        &.expense {
            border-left: 3px solid #ef4444;
        }
        &.income {
            border-left: 3px solid var(--color-green);
        }

        .item-left {
            display: flex;
            align-items: center;
            gap: 0.8rem;

            .indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                &.expense {
                    background: #ef4444;
                }
                &.income {
                    background: var(--color-green);
                }
            }

            .item-details {
                display: flex;
                flex-direction: column;
                gap: 0.2rem;

                .item-title {
                    font-weight: 600;
                    color: var(--primary-color);
                    font-size: 0.95rem;
                }

                .item-meta {
                    display: flex;
                    gap: 0.6rem;
                    font-size: 0.75rem;
                    color: rgba(34, 34, 96, 0.5);

                    .category {
                        text-transform: capitalize;
                        background: rgba(34, 34, 96, 0.08);
                        padding: 0.1rem 0.4rem;
                        border-radius: 4px;
                    }
                }
            }
        }

        .item-amount {
            font-weight: 700;
            font-size: 1rem;

            &.expense {
                color: #ef4444;
            }
            &.income {
                color: var(--color-green);
            }
        }
    }

    .no-history {
        text-align: center;
        color: rgba(34, 34, 96, 0.5);
        padding: 1.5rem;
        font-style: italic;
    }
`;

export default History