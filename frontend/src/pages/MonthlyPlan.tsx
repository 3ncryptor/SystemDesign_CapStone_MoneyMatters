import React, { useState, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';
import { Target, Calendar, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

interface MonthlyPlanData {
    _id: string;
    month: number;
    year: number;
    savingGoal: number;
    achievedSavings: number;
    goalMet: boolean;
    isClosed: boolean;
}

const MonthlyPlan: React.FC = () => {
    const [plans, setPlans] = useState<MonthlyPlanData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [goal, setGoal] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchPlans = async () => {
        try {
            const response = await api.get('/monthly-plan');
            setPlans(response.data.data);
        } catch (err) {
            console.error('Error fetching monthly plans', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPlans();
    }, []);

    const handleSetGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        const now = new Date();

        if (currentMonthPlan) {
            setMessage({
                type: 'error',
                text: currentMonthPlan.isClosed
                    ? 'Current month is already closed. You cannot set another goal for this month.'
                    : 'Monthly plan already exists for this month.',
            });
            return;
        }

        try {
            await api.post('/monthly-plan', {
                month: now.getMonth() + 1,
                year: now.getFullYear(),
                savingGoal: Number(goal)
            });
            setMessage({ type: 'success', text: 'Goal set successfully!' });
            setGoal('');
            fetchPlans();
        } catch (err) {
            const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
            setMessage({ type: 'error', text: message || 'Failed to set goal.' });
        }
    };

    const handleCloseMonth = async () => {
        if (!confirm('Are you sure you want to close this month? This will calculate your final savings and cannot be undone.')) return;
        try {
            await api.post('/monthly-plan/close');
            setMessage({ type: 'success', text: 'Month closed successfully!' });
            fetchPlans();
        } catch (err) {
            const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
            setMessage({ type: 'error', text: message || 'Failed to close month.' });
        }
    };

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const currentMonthPlan = plans.find(p => p.month === currentMonth && p.year === currentYear);
    const pastPlans = plans.filter(p => p.isClosed).sort((a, b) => (b.year * 12 + b.month) - (a.year * 12 + a.month));

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 className="font-bold text-2xl">Monthly Saving Goals</h1>
                <p className="text-muted">Plan your savings and track your progress over time.</p>
            </header>

            {message.text && (
                <div style={{
                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${message.type === 'success' ? 'var(--income)' : 'var(--destructive)'}`,
                    color: message.type === 'success' ? 'var(--income)' : 'var(--destructive)',
                    padding: '1rem',
                    borderRadius: 'var(--radius)',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', alignItems: 'start' }}>
                {/* Set/Manage Current Goal */}
                <div className="card">
                    <div className="flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                        <Target size={24} className="text-primary" />
                        <h3 className="font-bold">Current Month Goal</h3>
                    </div>

                    {!currentMonthPlan ? (
                        <form onSubmit={handleSetGoal} className="flex flex-col gap-4">
                            <p className="text-muted text-sm">You haven't set a saving goal for this month yet.</p>
                            <div className="flex flex-col gap-2">
                                <label style={{ fontSize: '0.875rem' }}>How much do you want to save this month?</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }}>$</span>
                                    <input
                                        type="number"
                                        placeholder="5000"
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value)}
                                        required
                                        style={{ paddingLeft: '2rem' }}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Set Saving Goal</button>
                        </form>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="card" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem' }}>
                                    <p className="text-muted text-sm">Target</p>
                                    <p className="font-bold text-2xl">${currentMonthPlan.savingGoal.toLocaleString()}</p>
                                </div>
                                <div className="card" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem' }}>
                                    <p className="text-muted text-sm">Status</p>
                                    <p className={`font-bold text-2xl ${currentMonthPlan.isClosed ? 'text-income' : 'text-primary'}`}>
                                        {currentMonthPlan.isClosed ? 'Closed' : 'Active'}
                                    </p>
                                </div>
                            </div>

                            {!currentMonthPlan.isClosed ? (
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                                    <h4 className="font-bold" style={{ marginBottom: '1rem' }}>Danger Zone</h4>
                                    <p className="text-muted text-sm" style={{ marginBottom: '1.25rem' }}>
                                        Closing the month will lock all transactions and calculate your final savings against your goal.
                                    </p>
                                    <button onClick={handleCloseMonth} className="btn btn-secondary" style={{ width: '100%', color: 'var(--destructive)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                        <Lock size={18} />
                                        <span>Close Month & Calculate Savings</span>
                                    </button>
                                </div>
                            ) : (
                                <p className="text-muted text-sm" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                    This month's plan is already closed. You can review the result in Performance History.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Past Performance */}
                <div className="card">
                    <div className="flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                        <Calendar size={24} className="text-primary" />
                        <h3 className="font-bold">Performance History</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
                        ) : pastPlans.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center' }} className="text-muted">
                                No historical data available yet.
                            </div>
                        ) : (
                            pastPlans.map(plan => (
                                <div key={plan._id} className="card" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                                        <div>
                                            <p className="font-bold">{monthNames[plan.month - 1]} {plan.year}</p>
                                            <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '1rem', background: plan.goalMet ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: plan.goalMet ? 'var(--income)' : 'var(--expense)', fontWeight: 600 }}>
                                                {plan.goalMet ? 'GOAL MET' : 'GOAL MISSED'}
                                            </span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p className="text-muted text-sm">Goal: ${plan.savingGoal.toLocaleString()}</p>
                                            <p className={`font-bold ${plan.achievedSavings >= 0 ? 'text-income' : 'text-expense'}`}>
                                                SAVED: ${plan.achievedSavings.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ width: '100%', height: '6px', background: 'var(--muted)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${Math.min((plan.achievedSavings / plan.savingGoal) * 100, 100)}%`,
                                            background: plan.goalMet ? 'var(--income)' : 'var(--primary)',
                                            opacity: plan.achievedSavings > 0 ? 1 : 0
                                        }}></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyPlan;
