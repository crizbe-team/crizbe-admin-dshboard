'use client';

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import {
    ShieldCheck,
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    RefreshCw,
    Users,
    KeyRound,
    Lock,
} from 'lucide-react';
import {
    useFetchAdminRoles,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
} from '@/queries/use-account';
import { RoleData } from '@/services/account';

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

// Available system access permissions that can be toggled per role
const ALL_MODULE_PERMISSIONS = [
    { key: 'dashboard', label: 'Dashboard Overview', desc: 'View sales stats, analytics charts & activity' },
    { key: 'categories', label: 'Categories', desc: 'Create, update & delete product categories' },
    { key: 'products', label: 'Products', desc: 'Create, edit, feature & manage products' },
    { key: 'variants', label: 'Product Variants', desc: 'Manage product weight & flavour variants' },
    { key: 'stock', label: 'Inventory / Stock', desc: 'Update product stock levels & history' },
    { key: 'orders', label: 'Order Management', desc: 'View customer orders & update tracking status' },
    { key: 'sales', label: 'Sales Performance', desc: 'View detailed revenue reports & metrics' },
    { key: 'clients', label: 'Clients / Customers', desc: 'View registered customer details & history' },
    { key: 'enquiries', label: 'Enquiries & Messages', desc: 'Read contact messages & customer feedback' },
    { key: 'currencies', label: 'Currencies & Rates', desc: 'Manage global currencies & conversion rates' },
    { key: 'roles', label: 'Roles & Access Control', desc: 'Manage admin roles and permission matrices' },
    { key: 'users', label: 'Sub-Admin Users', desc: 'Create and manage sub-admin user logins' },
    { key: 'settings', label: 'System Settings', desc: 'Configure general administration settings' },
];

export default function RolesPage() {
    const { data: rolesRes, isLoading, isRefetching, refetch } = useFetchAdminRoles();
    const createMutation = useCreateRoleMutation();
    const updateMutation = useUpdateRoleMutation();
    const deleteMutation = useDeleteRoleMutation();

    const roles: RoleData[] = rolesRes?.data || [];

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleData | null>(null);

    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    const openAddModal = () => {
        setEditingRole(null);
        setFormName('');
        setFormDescription('');
        setSelectedPermissions(['dashboard', 'products', 'categories']);
        setIsModalOpen(true);
    };

    const openEditModal = (role: RoleData) => {
        setEditingRole(role);
        setFormName(role.name);
        setFormDescription(role.description || '');
        setSelectedPermissions(role.permissions || []);
        setIsModalOpen(true);
    };

    const handleTogglePermission = (permissionKey: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionKey)
                ? prev.filter((p) => p !== permissionKey)
                : [...prev, permissionKey]
        );
    };

    const handleSelectAll = () => {
        if (selectedPermissions.length === ALL_MODULE_PERMISSIONS.length) {
            setSelectedPermissions([]);
        } else {
            setSelectedPermissions(ALL_MODULE_PERMISSIONS.map((p) => p.key));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: formName.trim(),
            description: formDescription.trim(),
            permissions: selectedPermissions,
        };

        if (editingRole && editingRole.id) {
            await updateMutation.mutateAsync({ id: editingRole.id, data: payload });
        } else {
            await createMutation.mutateAsync(payload);
        }

        setIsModalOpen(false);
    };

    const handleDeleteRole = async (id?: string) => {
        if (!id) return;
        if (confirm('Are you sure you want to delete this role? Assigned users will lose custom access permissions.')) {
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
                        <ShieldCheck className="w-9 h-9 text-[#E8BF7A]" />
                        Roles & Role-Based Access Control (RBAC)
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base font-medium">
                        Create custom admin roles (e.g. Content Writer, Inventory Manager) and select exact module accesses.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-sm font-semibold transition flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
                        Refresh Roles
                    </button>

                    <button
                        onClick={openAddModal}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9A7236] to-[#E8BF7A] text-[#1a1a1a] font-bold text-sm hover:brightness-110 shadow-lg transition flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create New Role
                    </button>
                </div>
            </motion.div>

            {/* Roles Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full p-12 text-center text-gray-400 font-medium animate-pulse">
                        Loading admin roles and permission matrices...
                    </div>
                ) : roles.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-gray-400 font-medium bg-[#141414] rounded-3xl border border-white/10">
                        No custom roles created yet. Click "Create New Role" to configure access permissions.
                    </div>
                ) : (
                    roles.map((role) => (
                        <div
                            key={role.id || role.name}
                            className="bg-[#141414] rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:border-[#E8BF7A]/40 transition shadow-xl relative overflow-hidden group"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="w-11 h-11 rounded-2xl bg-[#E8BF7A]/10 border border-[#E8BF7A]/20 flex items-center justify-center text-[#E8BF7A]">
                                        <KeyRound className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-[#E8BF7A]" />
                                        {role.user_count ?? 0} Users Assigned
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white font-bricolage">{role.name}</h3>
                                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                                        {role.description || 'Custom administrative role with specific module access rights.'}
                                    </p>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-white/5">
                                    <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        <span>Module Access</span>
                                        <span className="text-[#E8BF7A]">
                                            {role.permissions?.length ?? 0} / {ALL_MODULE_PERMISSIONS.length} Allowed
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {(role.permissions || []).map((permKey) => {
                                            const match = ALL_MODULE_PERMISSIONS.find((p) => p.key === permKey);
                                            return (
                                                <span
                                                    key={permKey}
                                                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                                                >
                                                    {match?.label || permKey}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-6 mt-6 border-t border-white/10">
                                <button
                                    onClick={() => openEditModal(role)}
                                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    Edit Role
                                </button>
                                <button
                                    onClick={() => handleDeleteRole(role.id)}
                                    className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition flex items-center gap-1.5"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </motion.div>

            {/* Modal for Creating / Editing Role & Access Matrix */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8"
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-2">
                            <Lock className="w-6 h-6 text-[#E8BF7A]" />
                            <h3 className="text-xl font-bold text-white font-bricolage">
                                {editingRole ? 'Edit Role & Permissions' : 'Create New Admin Role'}
                            </h3>
                        </div>
                        <p className="text-gray-400 text-xs mb-6">
                            Configure role title and select the exact access permissions this role is allowed to view and manage.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">
                                        Role Name / Title
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                        placeholder="e.g. Content Writer, Inventory Manager"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E8BF7A]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">
                                        Description (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formDescription}
                                        onChange={(e) => setFormDescription(e.target.value)}
                                        placeholder="e.g. Manages blog, products, and categories"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E8BF7A]"
                                    />
                                </div>
                            </div>

                            {/* Permission Matrix Checkbox Grid */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-[#E8BF7A] uppercase tracking-wider">
                                        Module Access Permissions ({selectedPermissions.length} selected)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleSelectAll}
                                        className="text-xs font-bold text-gray-400 hover:text-white underline transition"
                                    >
                                        {selectedPermissions.length === ALL_MODULE_PERMISSIONS.length
                                            ? 'Deselect All'
                                            : 'Select All Accesses'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1 pr-2 custom-scrollbar">
                                    {ALL_MODULE_PERMISSIONS.map((perm) => {
                                        const isChecked = selectedPermissions.includes(perm.key);
                                        return (
                                            <div
                                                key={perm.key}
                                                onClick={() => handleTogglePermission(perm.key)}
                                                className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 select-none ${
                                                    isChecked
                                                        ? 'bg-[#E8BF7A]/10 border-[#E8BF7A]/40 text-white'
                                                        : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
                                                }`}
                                            >
                                                <div
                                                    className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition ${
                                                        isChecked
                                                            ? 'bg-[#E8BF7A] border-[#E8BF7A] text-[#1a1a1a]'
                                                            : 'border-white/20 bg-white/5'
                                                    }`}
                                                >
                                                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                </div>

                                                <div>
                                                    <h4 className="text-xs font-bold text-white">{perm.label}</h4>
                                                    <p className="text-[10px] text-gray-400 leading-snug mt-0.5">
                                                        {perm.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
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
                                    Save Role
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
