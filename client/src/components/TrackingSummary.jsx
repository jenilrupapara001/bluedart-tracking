import React from 'react';
import { Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';

const TrackingSummary = ({ records }) => {
    const stats = {
        total: records.length,
        delivered: records.filter(r => r.currentStatus?.toLowerCase().includes('delivered')).length,
        inTransit: records.filter(r => r.currentStatus?.toLowerCase().includes('transit') || r.currentStatus?.toLowerCase().includes('out')).length,
        pending: records.filter(r => r.currentStatus?.toLowerCase().includes('pending')).length,
    };

    const cards = [
        { label: 'Total Shipments', value: stats.total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'In Transit', value: stats.inTransit, icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Pending', value: stats.pending, icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-50' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {cards.map((card, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-all hover:shadow-md">
                    <div className={`${card.bg} p-3 rounded-xl`}>
                        <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{card.label}</p>
                        <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TrackingSummary;
