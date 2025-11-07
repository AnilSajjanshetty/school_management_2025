// components/ClassTeacherDashboard/CTErrorState.jsx
import { AlertCircle } from 'lucide-react';

export const CTErrorState = ({ error, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium">{error}</p>
        <button
            onClick={onRetry}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
            Retry
        </button>
    </div>
);