// src/components/HeadmasterDashboard/HContactMessages.jsx
export const HContactMessages = ({ contactMessages }) => (
    <div>
        <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Contact Messages</h2>
        <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {contactMessages.map(msg => (
                        <tr key={msg.id}>
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${msg.type === "complaint" ? "bg-red-100 text-red-800" :
                                        msg.type === "inquiry" ? "bg-blue-100 text-blue-800" :
                                            "bg-green-100 text-green-800"
                                    }`}>
                                    {msg.type}
                                </span>
                            </td>
                            <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-900">{msg.message}</td>
                            <td className="px-4 lg:px-6 py-4 text-xs lg:text-sm text-gray-500">{msg.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {contactMessages.length === 0 && (
                <p className="text-center py-8 text-gray-500 text-sm">No messages yet.</p>
            )}
        </div>
    </div>
);