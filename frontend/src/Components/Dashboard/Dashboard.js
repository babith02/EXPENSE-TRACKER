import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import { dollar, trend, expenses as expenseIcon, piggy, calender, book, food, medical, tv, takeaway, clothing, freelance, circle } from '../../utils/Icons';
import Chart from '../Chart/Chart';

function Dashboard() {
    const {
        totalExpenses,
        incomes,
        expenses,
        totalIncome,
        totalBalance,
        getIncomes,
        getExpenses,
        getExpensesByCategory,
        getSavingsRate,
        getTransactionCount,
        getAverageIncome,
        getAverageExpense
    } = useGlobalContext()

    useEffect(() => {
        getIncomes()
        getExpenses()
    }, [])

    const getCurrentDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        return new Date().toLocaleDateString('en-US', options)
    }

    const balance = totalBalance()
    const savingsRate = getSavingsRate()
    const transactionCount = getTransactionCount()
    const expensesByCategory = getExpensesByCategory()

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'education': return book;
            case 'groceries': return food;
            case 'health': return medical;
            case 'subscriptions': return tv;
            case 'takeaways': return takeaway;
            case 'clothing': return clothing;
            case 'travelling': return freelance;
            default: return circle;
        }
    }

    const getCategoryColor = (category) => {
        const colors = {
            education: '#6366f1',
            groceries: '#22c55e',
            health: '#ef4444',
            subscriptions: '#8b5cf6',
            takeaways: '#f59e0b',
            clothing: '#ec4899',
            travelling: '#06b6d4',
            other: '#64748b'
        }
        return colors[category] || colors.other
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount)
    }

    return (
        <DashboardStyled>
            <InnerLayout>
                <div className="dashboard-header">
                    <div className="header-left">
                        <h1>Financial Overview</h1>
                        <p className="date">{calender} {getCurrentDate()}</p>
                    </div>
                    <div className="header-stats">
                        <div className="stat-badge">
                            <span className="label">Transactions</span>
                            <span className="value">{transactionCount.total}</span>
                        </div>
                        <div className="stat-badge savings">
                            <span className="label">Savings Rate</span>
                            <span className="value">{savingsRate}%</span>
                        </div>
                    </div>
                </div>

                <div className="summary-cards">
                    <div className="card income-card">
                        <div className="card-icon income-icon">
                            {trend}
                        </div>
                        <div className="card-content">
                            <h3>Total Income</h3>
                            <p className="amount income-amount">${formatCurrency(totalIncome())}</p>
                            <div className="card-meta">
                                <span>{transactionCount.incomes} transactions</span>
                                <span>Avg: ${formatCurrency(getAverageIncome())}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card expense-card">
                        <div className="card-icon expense-icon">
                            {expenseIcon}
                        </div>
                        <div className="card-content">
                            <h3>Total Expenses</h3>
                            <p className="amount expense-amount">${formatCurrency(totalExpenses())}</p>
                            <div className="card-meta">
                                <span>{transactionCount.expenses} transactions</span>
                                <span>Avg: ${formatCurrency(getAverageExpense())}</span>
                            </div>
                        </div>
                    </div>

                    <div className={`card balance-card ${balance >= 0 ? 'positive' : 'negative'}`}>
                        <div className="card-icon balance-icon">
                            {piggy}
                        </div>
                        <div className="card-content">
                            <h3>Net Balance</h3>
                            <p className={`amount balance-amount ${balance >= 0 ? 'positive' : 'negative'}`}>
                                {balance >= 0 ? '+' : ''}{dollar} {formatCurrency(Math.abs(balance))}
                            </p>
                            <div className="card-meta">
                                <span>{balance >= 0 ? 'You\'re saving money!' : 'Spending exceeds income'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="main-content">
                    <div className="chart-section">
                        <h2 className="section-title">Income vs Expenses Trend</h2>
                        <div className="chart-wrapper">
                            <Chart />
                        </div>
                    </div>

                    <div className="side-section">
                        <div className="category-breakdown">
                            <h2 className="section-title">Spending by Category</h2>
                            <div className="category-list">
                                {Object.keys(expensesByCategory).length > 0 ? (
                                    Object.entries(expensesByCategory)
                                        .sort(([,a], [,b]) => b - a)
                                        .slice(0, 5)
                                        .map(([category, amount]) => {
                                            const percentage = ((amount / totalExpenses()) * 100).toFixed(1)
                                            return (
                                                <div key={category} className="category-item">
                                                    <div className="category-info">
                                                        <span className="category-icon" style={{ color: getCategoryColor(category) }}>
                                                            {getCategoryIcon(category)}
                                                        </span>
                                                        <span className="category-name">{category}</span>
                                                    </div>
                                                    <div className="category-stats">
                                                        <span className="category-amount">${formatCurrency(amount)}</span>
                                                        <span className="category-percent">{percentage}%</span>
                                                    </div>
                                                    <div className="progress-bar">
                                                        <div 
                                                            className="progress-fill" 
                                                            style={{ 
                                                                width: `${percentage}%`,
                                                                backgroundColor: getCategoryColor(category)
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                ) : (
                                    <p className="no-data">No expense data available</p>
                                )}
                            </div>
                        </div>

                        <div className="history-section">
                            <History />
                        </div>

                        <div className="min-max-section">
                            <div className="min-max-item">
                                <h3 className="min-max-title">Income Range</h3>
                                <div className="min-max-values">
                                    <div className="min-value">
                                        <span className="label">Min</span>
                                        <span className="value">
                                            ${incomes.length > 0 ? formatCurrency(Math.min(...incomes.map(item => item.amount))) : '0.00'}
                                        </span>
                                    </div>
                                    <div className="range-bar income-range"></div>
                                    <div className="max-value">
                                        <span className="label">Max</span>
                                        <span className="value">
                                            ${incomes.length > 0 ? formatCurrency(Math.max(...incomes.map(item => item.amount))) : '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="min-max-item">
                                <h3 className="min-max-title">Expense Range</h3>
                                <div className="min-max-values">
                                    <div className="min-value">
                                        <span className="label">Min</span>
                                        <span className="value">
                                            ${expenses.length > 0 ? formatCurrency(Math.min(...expenses.map(item => item.amount))) : '0.00'}
                                        </span>
                                    </div>
                                    <div className="range-bar expense-range"></div>
                                    <div className="max-value">
                                        <span className="label">Max</span>
                                        <span className="value">
                                            ${expenses.length > 0 ? formatCurrency(Math.max(...expenses.map(item => item.amount))) : '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    )
}

const DashboardStyled = styled.div`
    .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;

        .header-left {
            h1 {
                font-size: 2rem;
                margin-bottom: 0.3rem;
            }
            .date {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: rgba(34, 34, 96, 0.6);
                font-size: 0.95rem;
                i {
                    font-size: 1rem;
                }
            }
        }

        .header-stats {
            display: flex;
            gap: 1rem;

            .stat-badge {
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                border-radius: 12px;
                padding: 0.7rem 1.2rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 100px;

                .label {
                    font-size: 0.75rem;
                    color: rgba(34, 34, 96, 0.6);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .value {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: var(--primary-color);
                }

                &.savings {
                    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                    .value {
                        color: var(--color-green);
                    }
                }
            }
        }
    }

    .summary-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;

        @media (max-width: 1200px) {
            grid-template-columns: repeat(2, 1fr);
        }
        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }

        .card {
            background: #FCF6F9;
            border: 2px solid #FFFFFF;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            border-radius: 20px;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1.2rem;
            transition: transform 0.2s ease, box-shadow 0.2s ease;

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
            }

            .card-icon {
                width: 60px;
                height: 60px;
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                i {
                    font-size: 1.8rem;
                    color: white;
                }
            }

            .income-icon {
                background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            }
            .expense-icon {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            }
            .balance-icon {
                background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            }

            .card-content {
                flex: 1;
                h3 {
                    font-size: 0.9rem;
                    color: rgba(34, 34, 96, 0.7);
                    margin-bottom: 0.3rem;
                    font-weight: 600;
                }
                .amount {
                    font-size: 1.8rem;
                    font-weight: 800;
                    margin-bottom: 0.4rem;
                }
                .income-amount {
                    color: var(--color-green);
                }
                .expense-amount {
                    color: #ef4444;
                }
                .balance-amount {
                    &.positive {
                        color: var(--color-green);
                    }
                    &.negative {
                        color: #ef4444;
                    }
                }
                .card-meta {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    span {
                        font-size: 0.8rem;
                        color: rgba(34, 34, 96, 0.5);
                    }
                }
            }

            &.positive {
                border-left: 4px solid var(--color-green);
            }
            &.negative {
                border-left: 4px solid #ef4444;
            }
        }
    }

    .main-content {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: 2rem;

        @media (max-width: 1200px) {
            grid-template-columns: 1fr;
        }

        .section-title {
            font-size: 1.2rem;
            margin-bottom: 1rem;
            color: var(--primary-color);
        }

        .chart-section {
            .chart-wrapper {
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                border-radius: 20px;
                padding: 1.5rem;
                height: 350px;
            }
        }

        .side-section {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;

            .category-breakdown {
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                border-radius: 20px;
                padding: 1.2rem;

                .category-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }

                .category-item {
                    .category-info {
                        display: flex;
                        align-items: center;
                        gap: 0.6rem;
                        margin-bottom: 0.3rem;

                        .category-icon {
                            i {
                                font-size: 1rem;
                            }
                        }
                        .category-name {
                            font-size: 0.9rem;
                            text-transform: capitalize;
                            color: var(--primary-color);
                            font-weight: 500;
                        }
                    }

                    .category-stats {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 0.4rem;

                        .category-amount {
                            font-size: 0.85rem;
                            font-weight: 600;
                            color: var(--primary-color);
                        }
                        .category-percent {
                            font-size: 0.8rem;
                            color: rgba(34, 34, 96, 0.5);
                        }
                    }

                    .progress-bar {
                        height: 6px;
                        background: rgba(34, 34, 96, 0.1);
                        border-radius: 3px;
                        overflow: hidden;

                        .progress-fill {
                            height: 100%;
                            border-radius: 3px;
                            transition: width 0.3s ease;
                        }
                    }
                }

                .no-data {
                    text-align: center;
                    color: rgba(34, 34, 96, 0.5);
                    padding: 1rem;
                    font-style: italic;
                }
            }

            .history-section {
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                border-radius: 20px;
                padding: 1.2rem;
            }

            .min-max-section {
                display: flex;
                flex-direction: column;
                gap: 1rem;

                .min-max-item {
                    background: #FCF6F9;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                    border-radius: 16px;
                    padding: 1rem;

                    .min-max-title {
                        font-size: 0.95rem;
                        margin-bottom: 0.8rem;
                        text-align: center;
                        color: var(--primary-color);
                    }

                    .min-max-values {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 0.5rem;

                        .min-value, .max-value {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            min-width: 80px;

                            .label {
                                font-size: 0.7rem;
                                text-transform: uppercase;
                                color: rgba(34, 34, 96, 0.5);
                                letter-spacing: 0.5px;
                            }
                            .value {
                                font-size: 1rem;
                                font-weight: 700;
                                color: var(--primary-color);
                            }
                        }

                        .range-bar {
                            flex: 1;
                            height: 8px;
                            border-radius: 4px;
                            position: relative;

                            &.income-range {
                                background: linear-gradient(90deg, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 1) 100%);
                            }
                            &.expense-range {
                                background: linear-gradient(90deg, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 1) 100%);
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default Dashboard
