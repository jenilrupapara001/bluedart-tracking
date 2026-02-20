import React, { useState } from 'react';
import { ExternalLink, MapPin, Calendar, CheckCircle2, Clock, AlertTriangle, ChevronDown, ChevronUp, Layers, RefreshCw } from 'lucide-react';

const TrackingTable = ({ records, loading, onRefresh }) => {
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [refreshingId, setRefreshingId] = useState(null);

    const handleSingleRefresh = async (e, id, trackingNumber) => {
        e.stopPropagation();
        setRefreshingId(id);
        try {
            await onRefresh(trackingNumber);
        } finally {
            setRefreshingId(null);
        }
    };

    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) newExpanded.delete(id);
        else newExpanded.add(id);
        setExpandedIds(newExpanded);
    };

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('delivered')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (s.includes('out for delivery')) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
        if (s.includes('transit') || s.includes('connected') || s.includes('arrived')) return 'bg-blue-100 text-blue-700 border-blue-200';
        if (s.includes('pending') || s.includes('picked up') || s.includes('sync')) return 'bg-amber-100 text-amber-700 border-amber-200';
        if (s.includes('delay') || s.includes('failed')) return 'bg-rose-100 text-rose-700 border-rose-200';
        return 'bg-slate-100 text-slate-700 border-slate-200';
    };

    const getStatusIcon = (status) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('delivered')) return <CheckCircle2 className="w-4 h-4" />;
        if (s.includes('out for delivery')) return <Layers className="w-4 h-4" />;
        if (s.includes('sync')) return <RefreshCw className="w-4 h-4 animate-spin" />;
        if (s.includes('transit')) return <Clock className="w-4 h-4" />;
        return <AlertTriangle className="w-4 h-4" />;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Recent Shipments</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="px-6 py-4 w-10"></th>
                            <th className="px-6 py-4">Tracking Number</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Current Detail</th>
                            <th className="px-6 py-4 w-12"></th>
                            <th className="px-6 py-4">Est. Delivery</th>
                            <th className="px-6 py-4">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {[...Array(6)].map((_, j) => (
                                        <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full" /></td>
                                    ))}
                                </tr>
                            ))
                        ) : records.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <p className="text-slate-400 font-medium">No shipments currently being tracked</p>
                                </td>
                            </tr>
                        ) : (
                            records.map((r) => (
                                <React.Fragment key={r._id}>
                                    <tr
                                        className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${expandedIds.has(r._id) ? 'bg-slate-50/50' : ''}`}
                                        onClick={() => toggleExpand(r._id)}
                                    >
                                        <td className="px-6 py-4 text-center">
                                            {expandedIds.has(r._id) ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-slate-700">{r.trackingNumber}</span>
                                                <a
                                                    href={`https://www.bluedart.com/tracking?handler=t&waybill=${r.trackingNumber}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-slate-300 hover:text-primary-600 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(r.currentStatus)}`}>
                                                {getStatusIcon(r.currentStatus)}
                                                {r.currentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={(e) => handleSingleRefresh(e, r._id, r.trackingNumber)}
                                                disabled={refreshingId === r._id}
                                                className={`p-2 rounded-full hover:bg-slate-200 transition-colors ${refreshingId === r._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <RefreshCw className={`w-3.5 h-3.5 ${refreshingId === r._id ? 'animate-spin' : ''}`} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <div
                                                    className="text-sm font-bold text-slate-700"
                                                    dangerouslySetInnerHTML={{ __html: r.lastActivity || 'No details available' }}
                                                />
                                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                                    <MapPin className="w-3 h-3" />
                                                    {r.lastLocation || 'Awaiting Update'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                {r.expectedDelivery ? new Date(r.expectedDelivery).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-slate-400">
                                            {new Date(r.lastUpdated).toLocaleString()}
                                        </td>
                                    </tr>

                                    {/* Detailed History View */}
                                    {expandedIds.has(r._id) && (
                                        <tr className="bg-slate-50/30">
                                            <td colSpan="6" className="px-12 py-6 border-l-2 border-primary-500">
                                                <div className="space-y-6">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Full Tracking History</h4>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase bg-white px-2 py-1 rounded border border-slate-100">
                                                            Detailed Checkpoints
                                                        </span>
                                                    </div>

                                                    {/* Metadata Summary Grid */}
                                                    <div className="grid grid-cols-4 gap-4">
                                                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Raw State</div>
                                                            <div className="text-sm font-black text-slate-800 tracking-tight">
                                                                {r.rawResponse?.data?.ShipmentState || r.currentStatus}
                                                            </div>
                                                        </div>
                                                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Scheduled</div>
                                                            <div className="text-sm font-black text-indigo-600 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                                                                {r.rawResponse?.data?.AdditionalInfo?.replace('Scheduled Delivery: ', '') || 'N/A'}
                                                            </div>
                                                        </div>
                                                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Fetch Time</div>
                                                            <div className="text-sm font-medium text-slate-600">
                                                                {r.rawResponse?.data?.FetchTime ? `${parseFloat(r.rawResponse.data.FetchTime).toFixed(2)}s` : 'N/A'}
                                                            </div>
                                                        </div>
                                                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">POD</div>
                                                            <div className="text-sm font-medium text-slate-600">
                                                                {r.rawResponse?.data?.PODImageUrl ? (
                                                                    <a href={r.rawResponse.data.PODImageUrl} target="_blank" rel="noreferrer" className="text-indigo-500 underline">View</a>
                                                                ) : 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="relative space-y-4">
                                                        {r.rawResponse?.data?.Checkpoints?.map((cp, idx) => (
                                                            <div key={idx} className="flex gap-4 relative">
                                                                {/* Timeline Line */}
                                                                {idx !== r.rawResponse.data.Checkpoints.length - 1 && (
                                                                    <div className="absolute left-2 top-5 bottom-0 w-0.5 bg-slate-200" />
                                                                )}

                                                                {/* Timeline Dot */}
                                                                <div className={`z-10 w-4 h-4 rounded-full border-2 bg-white mt-1 shrink-0 ${idx === 0 ? 'border-primary-500 scale-110 shadow-sm' : 'border-slate-300'
                                                                    }`} />

                                                                <div className="flex flex-col gap-1 pb-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-xs font-black text-slate-800 tracking-tight">
                                                                            {cp.Activity}
                                                                        </span>
                                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${cp.CheckpointState === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                                                                            cp.CheckpointState === 'outfordelivery' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                                                'bg-slate-50 text-slate-500 border-slate-100'
                                                                            }`}>
                                                                            {cp.CheckpointState}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                                                                        <div className="flex items-center gap-1">
                                                                            <MapPin className="w-3 h-3 text-slate-400" />
                                                                            {cp.Location || 'Scan Point'}
                                                                        </div>
                                                                        <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded shadow-sm">
                                                                            <Calendar className="w-3 h-3 text-slate-400" />
                                                                            {cp.Date}, {cp.Time}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {(!r.rawResponse?.data?.Checkpoints || r.rawResponse.data.Checkpoints.length === 0) && (
                                                            <div className="text-slate-400 text-sm italic py-4">
                                                                No checkpoint data available for this shipment yet.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TrackingTable;

