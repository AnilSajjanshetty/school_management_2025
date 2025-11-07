// components/ClassTeacherDashboard/CTLoadingState.jsx
import { RefreshCw } from 'lucide-react';

export const CTLoadingState = () => (
    <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-lg text-gray-600">Loading...</span>
    </div>
);