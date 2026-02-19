import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import { dollar, trend, expenses as expenseIcon, piggy, calender } from '../../utils/Icons';
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
        totalTransactionCount,
        averageIncome,
        averageExpense,
        savingsRate,
        expensesByCategory,
        getMonthlyData
    } = useGlobalContext()

    useEffect(() => {
        getIncomes()
        getExpenses()
    }, [])

    const balance = totalBalance()
    const isPositiveBalance = balance >= 0
    const monthlyData = getMonthlyData()
    const expenseCategories = expensesByCategory()
    const totalExpenseAmount = totalExpenses()

    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })

    const getCategoryLabel = (category) => {
        const labels = {
            education: 'Education',
            groceries: 'Groceries',
            health: 'Health',
            subscriptions: 'Subscriptions',
            takeaways: 'Takeaways',
            clothing: 'Clothing',
            travelling: 'Travelling',
            other: 'Other'
        }
        return labels[category] || category.charAt(0).toUpperCase() + category.slice(1)
    }

    const getCategoryColor = (category) => {
        const colors = {
            education: '#6366f1',
            groceries: '#22c55e',
            health: '#ef4444',
            subscriptions: '#f59e0b',
            takeaways: '#ec4899',
            clothing: '#8b5cf6',
            travelling: '#06b6d4',
            other: '#64748b'
        }
        return colors[category] || '#64748b'
    }

    return (
        <DashboardStyled>
            <InnerLayout>
                <div className="dashboard-header">
                    <h1>Financial Dashboard</h1>
                    <div className="date-badge">
                        {calender} <span>{currentMonth}</span>
                    </div>
                </div>

                <div className="quick-stats">
                    <div className="stat-card transactions">
                        <div className="stat-icon">{trend}</div>
                        <div className="stat-content">
                            <h3>Total Transactions</h3>
                            <p>{totalTransactionCount()}</p>
                        </div>
                    </div>
                    <div className="stat-card avg-income">
                        <div className="stat-icon">{dollar}</div>
                        <div className="stat-content">
                            <h3>Avg. Income</h3>
                            <p>${averageIncome()}</p>
                        </div>
                    </div>
                    <div className="stat-card avg-expense">
                        <div className="stat-icon">{expenseIcon}</div>
                        <div className="stat-content">
                            <h3>Avg. Expense</h3>
                            <p>${averageExpense()}</p>
                        </div>
                    </div>
                    <div className="stat-card savings">
                        <div className="stat-icon">{piggy}</div>
                        <div className="stat-content">
                            <h3>Savings Rate</h3>
                            <p className={parseFloat(savingsRate()) >= 0 ? 'positive' : 'negative'}>
                                {savingsRate()}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="stats-con">
                    <div className="chart-con">
                        <Chart />
                        <div className="amount-con">
                            <div className="income">
                                <h2>Total Income</h2>
                                <p className="income-value">
                                    {dollar} {totalIncome()}
                                </p>
                                <span className="sub-text">{incomes.length} transactions</span>
                            </div>
                            <div className="expense">
                                <h2>Total Expense</h2>
                                <p className="expense-value">
                                    {dollar} {totalExpenses()}
                                </p>
                                <span className="sub-text">{expenses.length} transactions</span>
                            </div>
                            <div className={`balance ${isPositiveBalance ? 'positive' : 'negative'}`}>
                                <h2>Total Balance</h2>
                                <p>
                                    {dollar} {balance}
                                </p>
                                <span className="sub-text">
                                    {isPositiveBalance ? 'You\'re on track!' : 'Spending exceeds income'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="history-con">
                        <History />

                        <div className="monthly-summary">
                            <h2>This Month's Summary</h2>
                            <div className="monthly-stats">
                                <div className="monthly-item">
                                    <span className="label">Income</span>
                                    <span className="value income-text">${monthlyData.monthlyIncomeTotal}</span>
                                </div>
                                <div className="monthly-item">
                                    <span className="label">Expenses</span>
                                    <span className="value expense-text">${monthlyData.monthlyExpenseTotal}</span>
                                </div>
                                <div className="monthly-item">
                                    <span className="label">Balance</span>
                                    <span className={`value ${monthlyData.monthlyBalance >= 0 ? 'income-text' : 'expense-text'}`}>
                                        ${monthlyData.monthlyBalance}
                                    </span>
                                </div>
                                <div className="monthly-item">
                                    <span className="label">Transactions</span>
                                    <span className="value">{monthlyData.monthlyTransactions}</span>
                                </div>
                            </div>
                        </div>

                        <h2 className="salary-title">Min <span>Income</span> Max</h2>
                        <div className="salary-item">
                            <p className="min-value">
                                ${incomes.length > 0 ? Math.min(...incomes.map(item => item.amount)) : 0}
                            </p>
                            <p className="max-value">
                                ${incomes.length > 0 ? Math.max(...incomes.map(item => item.amount)) : 0}
                            </p>
                        </div>
                        <h2 className="salary-title">Min <span>Expense</span> Max</h2>
                        <div className="salary-item">
                            <p className="min-value">
                                ${expenses.length > 0 ? Math.min(...expenses.map(item => item.amount)) : 0}
                            </p>
                            <p className="max-value">
                                ${expenses.length > 0 ? Math.max(...expenses.map(item => item.amount)) : 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="category-breakdown">
                    <h2>Expense Breakdown by Category</h2>
                    <div className="categories-grid">
                        {Object.entries(expenseCategories).map(([category, amount]) => {
                            const percentage = totalExpenseAmount > 0 
                                ? ((amount / totalExpenseAmount) * 100).toFixed(1) 
                                : 0
                            return (
                                <div className="category-card" key={category}>
                                    <div className="category-header">
                                        <span 
                                            className="category-indicator"
                                            style={{ backgroundColor: getCategoryColor(category) }}
                                        ></span>
                                        <h3>{getCategoryLabel(category)}</h3>
                                    </div>
                                    <div className="category-amount">${amount}</div>
                                    <div className="category-bar">
                                        <div 
                                            className="bar-fill"
                                            style={{ 
                                                width: `${percentage}%`,
                                                backgroundColor: getCategoryColor(category)
                                            }}
                                        ></div>
                                    </div>
                                    <span className="category-percentage">{percentage}% of total</span>
                                </div>
                            )
                        })}
                        {Object.keys(expenseCategories).length === 0 && (
                            <div className="no-data">No expense data available</div>
                        )}
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
        align-items: center;
        margin-bottom: 1.5rem;
        
        h1 {
            font-size: 2rem;
        }
        
        .date-badge {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 0.6rem 1.2rem;
            border-radius: 30px;
            font-weight: 600;
            font-size: 0.9rem;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            
            i {
                font-size: 1rem;
            }
        }
    }

    .quick-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;

        .stat-card {
            background: #FCF6F9;
            border: 2px solid #FFFFFF;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            border-radius: 20px;
            padding: 1.2rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: transform 0.2s ease, box-shadow 0.2s ease;

            &:hover {
                transform: translateY(-3px);
                box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
            }

            .stat-icon {
                width: 50px;
                height: 50px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                
                i {
                    font-size: 1.5rem;
                    color: white;
                }
            }

            .stat-content {
                h3 {
                    font-size: 0.85rem;
                    color: rgba(34, 34, 96, 0.6);
                    margin-bottom: 0.3rem;
                }
                p {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary-color);
                    
                    &.positive {
                        color: var(--color-green);
                    }
                    &.negative {
                        color: var(--color-delete);
                    }
                }
            }

            &.transactions .stat-icon {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            &.avg-income .stat-icon {
                background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            }
            &.avg-expense .stat-icon {
                background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
            }
            &.savings .stat-icon {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            }
        }
    }

    .stats-con {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 2rem;
        
        .chart-con {
            grid-column: 1 / 4;
            height: 400px;
            
            .amount-con {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 1.5rem;
                margin-top: 2rem;
                
                .income, .expense {
                    grid-column: span 2;
                }
                
                .income, .expense, .balance {
                    background: #FCF6F9;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                    border-radius: 20px;
                    padding: 1.2rem;
                    transition: transform 0.2s ease;

                    &:hover {
                        transform: translateY(-3px);
                    }
                    
                    h2 {
                        font-size: 1rem;
                        margin-bottom: 0.5rem;
                    }
                    
                    p {
                        font-size: 2.5rem;
                        font-weight: 700;
                    }
                    
                    .sub-text {
                        display: block;
                        font-size: 0.8rem;
                        color: rgba(34, 34, 96, 0.5);
                        margin-top: 0.5rem;
                    }
                }
                
                .income {
                    border-left: 4px solid var(--color-green);
                    
                    .income-value {
                        color: var(--color-green);
                    }
                }
                
                .expense {
                    border-left: 4px solid var(--color-delete);
                    
                    .expense-value {
                        color: var(--color-delete);
                    }
                }

                .balance {
                    grid-column: 2 / 4;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    
                    &.positive {
                        border: 2px solid var(--color-green);
                        background: linear-gradient(135deg, rgba(66, 173, 0, 0.05) 0%, rgba(66, 173, 0, 0.1) 100%);
                        
                        p {
                            color: var(--color-green);
                            font-size: 3rem;
                        }
                    }
                    
                    &.negative {
                        border: 2px solid var(--color-delete);
                        background: linear-gradient(135deg, rgba(255, 0, 0, 0.05) 0%, rgba(255, 0, 0, 0.1) 100%);
                        
                        p {
                            color: var(--color-delete);
                            font-size: 3rem;
                        }
                    }
                }
            }
        }

        .history-con {
            grid-column: 4 / -1;
            
            h2 {
                margin: 1rem 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .monthly-summary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                padding: 1.2rem;
                margin: 1.5rem 0;
                color: white;
                
                h2 {
                    color: white;
                    font-size: 1rem;
                    margin-bottom: 1rem;
                }
                
                .monthly-stats {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.8rem;
                    
                    .monthly-item {
                        display: flex;
                        flex-direction: column;
                        
                        .label {
                            font-size: 0.75rem;
                            opacity: 0.8;
                        }
                        
                        .value {
                            font-size: 1.1rem;
                            font-weight: 700;
                            
                            &.income-text {
                                color: #7dffb3;
                            }
                            &.expense-text {
                                color: #ffb3b3;
                            }
                        }
                    }
                }
            }
            
            .salary-title {
                font-size: 1.1rem;
                
                span {
                    font-size: 1.4rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            }
            
            .salary-item {
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                padding: 1rem;
                border-radius: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                
                p {
                    font-weight: 600;
                    font-size: 1.4rem;
                }
                
                .min-value {
                    color: var(--color-green);
                }
                
                .max-value {
                    color: var(--color-delete);
                }
            }
        }
    }

    .category-breakdown {
        margin-top: 2.5rem;
        
        h2 {
            margin-bottom: 1.5rem;
        }
        
        .categories-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
            
            .category-card {
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                border-radius: 20px;
                padding: 1.2rem;
                transition: transform 0.2s ease, box-shadow 0.2s ease;

                &:hover {
                    transform: translateY(-3px);
                    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
                }
                
                .category-header {
                    display: flex;
                    align-items: center;
                    gap: 0.7rem;
                    margin-bottom: 0.8rem;
                    
                    .category-indicator {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                    }
                    
                    h3 {
                        font-size: 1rem;
                        margin: 0;
                    }
                }
                
                .category-amount {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: var(--primary-color);
                    margin-bottom: 0.8rem;
                }
                
                .category-bar {
                    height: 8px;
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 0.5rem;
                    
                    .bar-fill {
                        height: 100%;
                        border-radius: 4px;
                        transition: width 0.5s ease;
                    }
                }
                
                .category-percentage {
                    font-size: 0.8rem;
                    color: rgba(34, 34, 96, 0.5);
                }
            }
            
            .no-data {
                grid-column: 1 / -1;
                text-align: center;
                padding: 2rem;
                color: rgba(34, 34, 96, 0.5);
                font-style: italic;
            }
        }
    }
`;

export default Dashboard