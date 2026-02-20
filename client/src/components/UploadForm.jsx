import React, { useState } from 'react';
import axios from 'axios';
import { Upload, X, Hash, Send } from 'lucide-react';

const UploadForm = ({ onUploadSuccess, apiBase }) => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const numbers = input.split(/[\n,]+/).map(t => t.trim()).filter(Boolean);
        if (!numbers.length) return;

        setLoading(true);
        setStatus(null);
        try {
            await axios.post(`${apiBase}/upload`, { trackingNumbers: numbers });
            setStatus({ type: 'success', message: `Processing ${numbers.length} tracking numbers...` });
            setInput('');
            onUploadSuccess();
        } catch (err) {
            setStatus({ type: 'error', message: 'Failed to upload tracking numbers' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                    <Hash className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">New Tracking</h2>
                    <p className="text-sm text-slate-500">Add Blue Dart waybills to monitor in real-time</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter tracking numbers separated by commas or new lines..."
                        className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-transparent transition-all outline-none resize-none text-slate-700 font-mono text-sm"
                    />
                    {input && (
                        <button
                            type="button"
                            onClick={() => setInput('')}
                            className="absolute top-2 right-2 p-1 rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {status && (
                            <p className={`text-sm font-medium ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {status.message}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-200 hover:bg-primary-700 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        {loading ? 'Processing...' : 'Start Tracking'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadForm;
