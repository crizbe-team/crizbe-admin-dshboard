'use client';

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import {
    DollarSign,
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    RefreshCw,
    Globe,
    ShieldCheck,
} from 'lucide-react';
import {
    useFetchAdminCurrencies,
    useCreateCurrencyMutation,
    useUpdateCurrencyMutation,
    useDeleteCurrencyMutation,
} from '@/queries/use-core';
import { CurrencyData } from '@/services/core';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
};

export default function SettingsPage() {
    const { data: currenciesRes, isLoading, isRefetching, refetch } = useFetchAdminCurrencies();
    const createMutation = useCreateCurrencyMutation();
    const updateMutation = useUpdateCurrencyMutation();
    const deleteMutation = useDeleteCurrencyMutation();

    const currencies: CurrencyData[] = currenciesRes?.data || [];

    // Modal state for Add/Edit Currency
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCurrency, setEditingCurrency] = useState<CurrencyData | null>(null);

    const [formCode, setFormCode] = useState('');
    const [formName, setFormName] = useState('');
    const [formSymbol, setFormSymbol] = useState('');
    const [formRate, setFormRate] = useState<string>('1.0');
    const [formActive, setFormActive] = useState(true);

    const openAddModal = () => {
        setEditingCurrency(null);
        setFormCode('');
        setFormName('');
        setFormSymbol('');
        setFormRate('1.0');
        setFormActive(true);
        setIsModalOpen(true);
    };

    const openEditModal = (item: CurrencyData) => {
        setEditingCurrency(item);
        setFormCode(item.code);
        setFormName(item.name);
        setFormSymbol(item.symbol);
        setFormRate(String(item.exchange_rate));
        setFormActive(item.is_active ?? true);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            code: formCode.trim().toUpperCase(),
            name: formName.trim(),
            symbol: formSymbol.trim(),
            exchange_rate: parseFloat(formRate) || 1.0,
            is_active: formActive,
        };

        if (editingCurrency && editingCurrency.id) {
            await updateMutation.mutateAsync({ id: editingCurrency.id, data: payload });
        } else {
            await createMutation.mutateAsync(payload);
        }

        setIsModalOpen(false);
    };

    const handleToggleActive = async (item: CurrencyData) => {
        if (!item.id) return;
        await updateMutation.mutateAsync({
            id: item.id,
            data: { is_active: !item.is_active },
        });
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (confirm('Are you sure you want to delete this currency?')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 pb-16 max-w-7xl mx-auto"
        >
            {/* Page Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-bricolage tracking-tight leading-none flex items-center gap-3">
                        <DollarSign className="w-9 h-9 text-[#E8BF7A]" />
                        Currency & Exchange Rates Settings
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base font-medium">
                        Manage global currencies, multi-currency conversion rates (base currency: <span className="text-[#E8BF7A] font-semibold">INR ₹</span>), and active status.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-sm font-semibold transition flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
                        Refresh Rates
                    </button>

                    <button
                        onClick={openAddModal}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] font-bold text-sm hover:brightness-110 shadow-lg transition flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Currency
                    </button>
                </div>
            </motion.div>

            {/* Currency Management Table / Cards */}
            <motion.div variants={itemVariants} className="bg-[#141414] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-[#E8BF7A]" />
                        <h2 className="text-lg font-bold text-white">Active Global Currencies</h2>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8BF7A]/10 text-[#E8BF7A] border border-[#E8BF7A]/20">
                        {currencies.length} Configured
                    </span>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-gray-400 font-medium animate-pulse">
                        Loading live currency rates from database...
                    </div>
                ) : currencies.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 font-medium">
                        No currencies configured. Click "Add New Currency" to get started.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-white/5 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Currency Code</th>
                                    <th className="px-6 py-4">Currency Name</th>
                                    <th className="px-6 py-4">Symbol</th>
                                    <th className="px-6 py-4">Rate (1 INR =)</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {currencies.map((c) => (
                                    <tr key={c.id || c.code} className="hover:bg-white/[0.02] transition">
                                        <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-[#E8BF7A]">
                                                {c.code}
                                            </span>
                                            {c.code}
                                            {c.is_default && (
                                                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                                                    Base (INR)
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 font-semibold">{c.name}</td>
                                        <td className="px-6 py-4 text-[#E8BF7A] font-bold text-base">{c.symbol}</td>
                                        <td className="px-6 py-4 font-mono font-bold text-white text-base">
                                            {c.exchange_rate}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleActive(c)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                                                    c.is_active
                                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                                }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${c.is_active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                                {c.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(c)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
                                                    title="Edit Exchange Rate"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                {!c.is_default && (
                                                    <button
                                                        onClick={() => handleDelete(c.id)}
                                                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                                                        title="Delete Currency"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* Modal for Adding/Editing Currency */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-2 font-bricolage">
                            {editingCurrency ? 'Edit Currency & Exchange Rate' : 'Add New Currency'}
                        </h3>
                        <p className="text-gray-400 text-xs mb-6">
                            Configure exchange conversion rate relative to base currency INR (1 INR = Rate).
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">
                                    Currency Code (ISO)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formCode}
                                    onChange={(e) => setFormCode(e.target.value)}
                                    placeholder="e.g. CAD, JPY, SAR"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#E8BF7A]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">
                                    Currency Display Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="e.g. Canadian Dollar"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E8BF7A]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">
                                    Currency Symbol
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formSymbol}
                                    onChange={(e) => setFormSymbol(e.target.value)}
                                    placeholder="e.g. CA$, ¥, SAR"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E8BF7A]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">
                                    Exchange Rate (1 INR = )
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    required
                                    value={formRate}
                                    onChange={(e) => setFormRate(e.target.value)}
                                    placeholder="e.g. 0.016"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#E8BF7A]"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="currencyActiveCheck"
                                    checked={formActive}
                                    onChange={(e) => setFormActive(e.target.checked)}
                                    className="w-4 h-4 rounded border-white/10 text-[#E8BF7A] focus:ring-0 accent-[#E8BF7A]"
                                />
                                <label htmlFor="currencyActiveCheck" className="text-sm font-semibold text-gray-300">
                                    Active for public site conversion
                                </label>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] font-bold text-sm hover:brightness-110 shadow-lg transition flex items-center justify-center gap-2"
                                >
                                    {(createMutation.isPending || updateMutation.isPending) && (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    )}
                                    Save Currency
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
