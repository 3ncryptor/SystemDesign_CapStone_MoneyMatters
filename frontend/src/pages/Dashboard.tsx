import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, PiggyBank, Target, ArrowUpRight, ArrowDownRight, History } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface DashboardData {
    kpis: {
        earnings: number;
        spendings: number;
        currentSavings: number;
    };
    categoryBreakdown: { category: string; amount: number }[];
    pieData: { income: number; expense: number; savings: number };
    goalProgress: { goal: number; currentSavings: number; percentage: number; goalMet: boolean };
}

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get('/dashboard');
                const payload = response.data?.data ?? {};

                setData({
                    kpis: {
                        earnings: payload.kpis?.earnings ?? payload.earnings ?? 0,
                        spendings: payload.kpis?.spendings ?? payload.spendings ?? 0,
                        currentSavings: payload.kpis?.currentSavings ?? payload.currentSavings ?? 0,
                    },
                    categoryBreakdown: payload.categoryBreakdown ?? [],
                    pieData: payload.pieData ?? payload.incomeVsExpense ?? {
                        income: 0,
                        expense: 0,
                        savings: 0,
                    },
                    goalProgress: payload.goalProgress ?? {
                        goal: 0,
                        currentSavings: 0,
                        percentage: 0,
                        goalMet: false,
                    },
                });
            } catch (err) {
                console.error('Error fetching dashboard data', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (isLoading || !data) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--muted)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
        );
    }

    const COLORS = ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#ec4899'];

    const incomeVsExpenseData = [
        { name: 'Income', amount: data.pieData.income },
        { name: 'Expense', amount: data.pieData.expense },
        { name: 'Savings', amount: data.pieData.savings },
    ];

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 className="font-bold text-2xl">Financial Overview</h1>
                <p className="text-muted">Track your income, expenses, and savings goals.</p>
            </header>

            {/* KPI Cards */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '2.5rem' }}>
                <motion.div whileHover={{ y: -5 }} className="card flex items-center gap-6">
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '1rem' }}>
                        <TrendingUp color="var(--income)" size={32} />
                    </div>
                    <div>
                        <p className="text-muted text-sm font-bold" style={{ textTransform: 'uppercase' }}>Monthly Earnings</p>
                        <h2 className="text-2xl font-bold" style={{ marginTop: '0.25rem' }}>${data.kpis.earnings.toLocaleString()}</h2>
                        <div className="flex items-center gap-1 text-income text-sm" style={{ marginTop: '0.5rem' }}>
                            <ArrowUpRight size={16} />
                            <span>Current Month</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="card flex items-center gap-6">
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '1rem' }}>
                        <TrendingDown color="var(--expense)" size={32} />
                    </div>
                    <div>
                        <p className="text-muted text-sm font-bold" style={{ textTransform: 'uppercase' }}>Monthly Spendings</p>
                        <h2 className="text-2xl font-bold" style={{ marginTop: '0.25rem' }}>${data.kpis.spendings.toLocaleString()}</h2>
                        <div className="flex items-center gap-1 text-expense text-sm" style={{ marginTop: '0.5rem' }}>
                            <ArrowDownRight size={16} />
                            <span>Current Month</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="card flex items-center gap-6">
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '1rem' }}>
                        <PiggyBank color="var(--savings)" size={32} />
                    </div>
                    <div>
                        <p className="text-muted text-sm font-bold" style={{ textTransform: 'uppercase' }}>Total Savings</p>
                        <h2 className="text-2xl font-bold" style={{ marginTop: '0.25rem' }}>${data.kpis.currentSavings.toLocaleString()}</h2>
                        <div className="flex items-center gap-1 text-primary text-sm" style={{ marginTop: '0.5rem' }}>
                            <History size={16} />
                            <span>All Closed Months</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                {/* Goal Progress */}
                <div className="card">
                    <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
                        <h3 className="font-bold">Monthly Goal Progress</h3>
                        <Target size={20} className="text-primary" />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <div className="flex justify-between" style={{ marginBottom: '0.75rem' }}>
                            <span className="text-muted">Target: ${data.goalProgress.goal.toLocaleString()}</span>
                            <span className="font-bold">{Math.round(data.goalProgress.percentage)}%</span>
                        </div>
                        <div style={{ width: '100%', height: '12px', background: 'var(--muted)', borderRadius: '6px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(data.goalProgress.percentage, 100)}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                style={{ height: '100%', background: 'var(--primary)' }}
                            ></motion.div>
                        </div>
                        {data.goalProgress.goalMet ? (
                            <p className="text-income text-sm font-bold" style={{ marginTop: '1rem' }}>Goal Met! Amazing work! 🎉</p>
                        ) : (
                            <p className="text-muted text-sm" style={{ marginTop: '1rem' }}>
                                Keep tracking to reach your goal of ${data.goalProgress.goal.toLocaleString()}.
                            </p>
                        )}
                    </div>

                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={incomeVsExpenseData}>
                            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                            />
                            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                {incomeVsExpenseData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--income)' : index === 1 ? 'var(--expense)' : 'var(--primary)'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Breakdown */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 className="font-bold" style={{ marginBottom: '1.5rem' }}>Expense Breakdown</h3>
                    <div style={{ flex: 1, minHeight: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.categoryBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="amount"
                                    nameKey="category"
                                >
                                    {data.categoryBreakdown.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
