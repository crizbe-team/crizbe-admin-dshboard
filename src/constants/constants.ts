import { CheckCircle, Clock, PackageCheck, Truck, XCircle } from 'lucide-react';

export const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    Pending: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
    Confirmed: { label: 'Confirmed', color: 'bg-blue-500', icon: CheckCircle },
    Shipped: { label: 'Shipped', color: 'bg-purple-500', icon: Truck },
    Delivered: { label: 'Delivered', color: 'bg-green-500', icon: PackageCheck },
    Cancelled: { label: 'Cancelled', color: 'bg-red-500', icon: XCircle },
};
