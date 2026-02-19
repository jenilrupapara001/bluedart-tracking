import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, RefreshCw, Layers } from 'lucide-react';
import TrackingSummary from './components/TrackingSummary';
import UploadForm from './components/UploadForm';
import TrackingTable from './components/TrackingTable';

const API_BASE = 'http://localhost:5001/api/track';

function App() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        setRefreshing(true);
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_BASE}/status`);
            setRecords(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = async (trackingNumber) => {
        try {
            await axios.post(`${API_BASE}/upload`, { trackingNumbers: trackingNumber });
            fetchData();
        } catch (err) {
            console.error('Refresh failed:', err);
        }
    };

    const handleDownload = () => {
        window.location.href = `${API_BASE}/report`;
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Navbar */}
            <nav className="sticky top-0 z-10 glass border-b border-slate-200 px-6 py-4 bg-white/80">
                <div className="max-w-full mx-auto flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-200">
                            <Layers className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-black tracking-tight text-slate-800 uppercase">
                            Blue<span className="text-primary-600">Dart</span> Pro
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchData}
                            disabled={refreshing}
                            className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all active:rotate-180"
                        >
                            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                        >
                            <Download className="w-4 h-4" />
                            Export Excel
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-full mx-auto px-6 py-8">
                <TrackingSummary records={records} />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    <div className="lg:col-span-1 sticky top-24">
                        <UploadForm onUploadSuccess={fetchData} />
                    </div>
                    <div className="lg:col-span-3">
                        <TrackingTable records={records} loading={loading} onRefresh={handleRefresh} />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-20 py-8 border-t border-slate-200 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Automated Shipment Intelligence System<br /> &copy; 2026 Blue Dart Automated Tracking
                </p>
            </footer>
        </div>
    );
}

export default App;
