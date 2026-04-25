import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, Filter, Calendar, DollarSign, Tag, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface Transaction {
    _id: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
}

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/transactions');
            setTransactions(response.data.data);
        } catch (err) {
            console.error('Error fetching transactions', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/transactions', {
                amount: Number(amount),
                type,
                category,
                date
            });
            setShowModal(false);
            resetForm();
            fetchTransactions();
        } catch (err: any) {
            console.error('Error adding transaction', err);
            const message = err.response?.data?.message || 'Failed to add transaction. Please check your input.';
            alert(message);
        }
    };

    const handleDeleteTransaction = async (id: string) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;
        try {
            await api.delete(`/transactions/${id}`);
            fetchTransactions();
        } catch (err) {
            console.error('Error deleting transaction', err);
        }
    };

    const resetForm = () => {
        setAmount('');
        setType('expense');
        setCategory('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    const categories = [
        'Salary', 'Freelance', 'Investment', 'Gift', // Income
        'Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Travel', 'Utilities', 'Other' // Expenses
    ];

    return (
        <div className="animate-fade-in">
            <header className="flex justify-between items-center" style={{ marginBottom: '2.5rem' }}>
                <div>
                    <h1 className="font-bold text-2xl">Transactions</h1>
                    <p className="text-muted">Manage your income and expenses.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    <Plus size={20} />
                    <span>Add Transaction</span>
                </button>
            </header>

            {/* Transaction List */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                        <input type="text" placeholder="Search transactions..." style={{ paddingLeft: '3rem' }} />
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '0.75rem' }}>
                        <Filter size={20} />
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--muted-foreground)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Date</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--muted-foreground)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Type</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--muted-foreground)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Category</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--muted-foreground)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Amount</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '4rem', textAlign: 'center' }}>
                                        <div style={{ width: '30px', height: '30px', border: '2px solid var(--muted)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '4rem', textAlign: 'center' }} className="text-muted">
                                        No transactions found. Add your first one!
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s ease' }} className="table-row-hover">
                                        <style>{`.table-row-hover:hover { background: rgba(255, 255, 255, 0.01); }`}</style>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-muted" />
                                                <span>{new Date(t.date).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '1rem',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                background: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: t.type === 'income' ? 'var(--income)' : 'var(--expense)'
                                            }}>
                                                {t.type === 'income' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                                                {t.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div className="flex items-center gap-2">
                                                <Tag size={16} className="text-muted" />
                                                <span>{t.category}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }} className={t.type === 'income' ? 'text-income' : 'text-expense'}>
                                            {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <button onClick={() => handleDeleteTransaction(t._id)} style={{ color: 'var(--muted-foreground)', transition: 'color 0.2s ease' }} className="hover-red">
                                                <style>{`.hover-red:hover { color: var(--destructive); }`}</style>
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Transaction Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card glass"
                            style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}
                        >
                            <h2 className="font-bold text-2xl" style={{ marginBottom: '1.5rem' }}>New Transaction</h2>

                            <form onSubmit={handleAddTransaction} className="flex flex-col gap-5">
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setType('expense')}
                                        className={`flex-1 btn ${type === 'expense' ? 'btn-primary' : 'btn-secondary'}`}
                                        style={{ background: type === 'expense' ? 'var(--expense)' : '' }}
                                    >
                                        Expense
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType('income')}
                                        className={`flex-1 btn ${type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
                                        style={{ background: type === 'income' ? 'var(--income)' : '' }}
                                    >
                                        Income
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Amount</label>
                                    <div style={{ position: 'relative' }}>
                                        <DollarSign size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            required
                                            style={{ paddingLeft: '3rem' }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                                        <option value="" disabled>Select a category</option>
                                        {categories.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Date</label>
                                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                                </div>

                                <div className="flex gap-3" style={{ marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn btn-secondary">Cancel</button>
                                    <button type="submit" className="flex-1 btn btn-primary">Save Transaction</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Transactions;
