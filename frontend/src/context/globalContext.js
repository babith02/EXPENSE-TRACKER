import React, { useContext, useState } from "react"
import axios from 'axios'


const BASE_URL = "http://localhost:5000/api/v1/";


const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    const addIncome = async (income) => {
        const response = await axios.post(`${BASE_URL}add-income`, income)
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getIncomes()
    }

    const getIncomes = async () => {
        const response = await axios.get(`${BASE_URL}get-incomes`)
        setIncomes(response.data)
        console.log(response.data)
    }

    const deleteIncome = async (id) => {
        const res  = await axios.delete(`${BASE_URL}delete-income/${id}`)
        getIncomes()
    }

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }

    const addExpense = async (income) => {
        const response = await axios.post(`${BASE_URL}add-expense`, income)
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getExpenses()
    }

    const getExpenses = async () => {
        const response = await axios.get(`${BASE_URL}get-expenses`)
        setExpenses(response.data)
        console.log(response.data)
    }

    const deleteExpense = async (id) => {
        const res  = await axios.delete(`${BASE_URL}delete-expense/${id}`)
        getExpenses()
    }

    const totalExpenses = () => {
        let total = 0;
        expenses.forEach((expense) =>{
            total = total + expense.amount
        })

        return total;
    }

    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        return history.slice(0, 3)
    }

    const totalTransactionCount = () => {
        return incomes.length + expenses.length
    }

    const averageIncome = () => {
        if (incomes.length === 0) return 0
        return (totalIncome() / incomes.length).toFixed(2)
    }

    const averageExpense = () => {
        if (expenses.length === 0) return 0
        return (totalExpenses() / expenses.length).toFixed(2)
    }

    const savingsRate = () => {
        const income = totalIncome()
        if (income === 0) return 0
        const savings = totalBalance()
        return ((savings / income) * 100).toFixed(1)
    }

    const expensesByCategory = () => {
        const categories = {}
        expenses.forEach((expense) => {
            if (categories[expense.category]) {
                categories[expense.category] += expense.amount
            } else {
                categories[expense.category] = expense.amount
            }
        })
        return categories
    }

    const incomesByCategory = () => {
        const categories = {}
        incomes.forEach((income) => {
            if (categories[income.category]) {
                categories[income.category] += income.amount
            } else {
                categories[income.category] = income.amount
            }
        })
        return categories
    }

    const getMonthlyData = () => {
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth()
        const currentYear = currentDate.getFullYear()

        const monthlyIncomes = incomes.filter((income) => {
            const incomeDate = new Date(income.date)
            return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear
        })

        const monthlyExpenses = expenses.filter((expense) => {
            const expenseDate = new Date(expense.date)
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
        })

        const monthlyIncomeTotal = monthlyIncomes.reduce((acc, income) => acc + income.amount, 0)
        const monthlyExpenseTotal = monthlyExpenses.reduce((acc, expense) => acc + expense.amount, 0)

        return {
            monthlyIncomeTotal,
            monthlyExpenseTotal,
            monthlyBalance: monthlyIncomeTotal - monthlyExpenseTotal,
            monthlyTransactions: monthlyIncomes.length + monthlyExpenses.length
        }
    }

    const getRecentActivity = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })
        return history.slice(0, 5)
    }


    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            totalTransactionCount,
            averageIncome,
            averageExpense,
            savingsRate,
            expensesByCategory,
            incomesByCategory,
            getMonthlyData,
            getRecentActivity,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () =>{
    return useContext(GlobalContext)
}