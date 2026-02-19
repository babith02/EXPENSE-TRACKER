import React from 'react'
import {Chart as ChartJs, 
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
} from 'chart.js'

import {Line} from 'react-chartjs-2'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { dateFormat } from '../../utils/dateFormat'

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
)

function Chart() {
    const {incomes, expenses} = useGlobalContext()

    const data = {
        labels: incomes.map((inc) =>{
            const {date} = inc
            return dateFormat(date)
        }),
        datasets: [
            {
                label: 'Income',
                data: [
                    ...incomes.map((income) => {
                        const {amount} = income
                        return amount
                    })
                ],
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#22c55e',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: 'Expenses',
                data: [
                    ...expenses.map((expense) => {
                        const {amount} = expense
                        return amount
                    })
                ],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                        family: "'Nunito', sans-serif",
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(34, 34, 96, 0.9)',
                titleFont: {
                    size: 13,
                    family: "'Nunito', sans-serif",
                },
                bodyFont: {
                    size: 12,
                    family: "'Nunito', sans-serif",
                },
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 11,
                        family: "'Nunito', sans-serif",
                    },
                    color: 'rgba(34, 34, 96, 0.5)',
                }
            },
            y: {
                grid: {
                    color: 'rgba(34, 34, 96, 0.08)',
                },
                ticks: {
                    font: {
                        size: 11,
                        family: "'Nunito', sans-serif",
                    },
                    color: 'rgba(34, 34, 96, 0.5)',
                    callback: function(value) {
                        return '$' + value.toLocaleString()
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    }


    return (
        <ChartStyled >
            <Line data={data} options={options} />
        </ChartStyled>
    )
}

const ChartStyled = styled.div`
    height: 100%;
    canvas {
        width: 100% !important;
        height: 100% !important;
    }
`;

export default Chart