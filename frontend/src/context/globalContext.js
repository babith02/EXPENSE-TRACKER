import React, { useContext, useState } from "react"
import axios from 'axios'


const BASE_URL = "http://localhost:5000/api/v1/";


const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    //calculate incomes
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


    //calculate incomes
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
        let totalIncome = 0;
        expenses.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
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

    const getExpensesByCategory = () => {
        const categoryTotals = {}
        expenses.forEach((expense) => {
            const { category, amount } = expense
            if (categoryTotals[category]) {
                categoryTotals[category] += amount
            } else {
                categoryTotals[category] = amount
            }
        })
        return categoryTotals
    }

    const getIncomesByCategory = () => {
        const categoryTotals = {}
        incomes.forEach((income) => {
            const { category, amount } = income
            if (categoryTotals[category]) {
                categoryTotals[category] += amount
            } else {
                categoryTotals[category] = amount
            }
        })
        return categoryTotals
    }

    const getSavingsRate = () => {
        const income = totalIncome()
        const expense = totalExpenses()
        if (income === 0) return 0
        return ((income - expense) / income * 100).toFixed(1)
    }

    const getTransactionCount = () => {
        return {
            total: incomes.length + expenses.length,
            incomes: incomes.length,
            expenses: expenses.length
        }
    }

    const getAverageIncome = () => {
        if (incomes.length === 0) return 0
        return (totalIncome() / incomes.length).toFixed(2)
    }

    const getAverageExpense = () => {
        if (expenses.length === 0) return 0
        return (totalExpenses() / expenses.length).toFixed(2)
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
            getExpensesByCategory,
            getIncomesByCategory,
            getSavingsRate,
            getTransactionCount,
            getAverageIncome,
            getAverageExpense,
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