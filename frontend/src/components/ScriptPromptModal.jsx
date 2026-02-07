import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

const ScriptPromptModal = ({ isOpen, onClose, onGenerate, isLoading }) => {
    const [customPrompt, setCustomPrompt] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (customPrompt.trim()) {
            onGenerate(customPrompt);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
                    <div className="flex items-center">
                        <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
                        <h2 className="text-xl font-bold text-slate-800">Custom Pitch Script</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            What would you like to focus on in your pitch?
                        </label>
                        <textarea
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            rows="6"
                            placeholder="Example: 'Create a 2-minute pitch for Series A investors focusing on our AI technology and market traction' or 'Generate a pitch for a startup competition highlighting our unique value proposition'"
                            disabled={isLoading}
                            required
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            💡 Be specific about your audience, key points, and desired tone
                        </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-sm font-semibold text-blue-900 mb-2">Quick Tips:</h3>
                        <ul className="text-xs text-blue-800 space-y-1">
                            <li>• Mention your target audience (investors, customers, partners)</li>
                            <li>• Specify pitch length (30 seconds, 2 minutes, 5 minutes)</li>
                            <li>• Highlight what to emphasize (technology, market, team, traction)</li>
                            <li>• Add tone preference (formal, casual, inspiring, data-driven)</li>
                        </ul>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium disabled:opacity-50 flex items-center"
                            disabled={isLoading || !customPrompt.trim()}
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            {isLoading ? 'Generating...' : 'Generate Script'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScriptPromptModal;
