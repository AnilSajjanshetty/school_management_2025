// src/components/HeadmasterDashboard/HTestimonials.jsx
export const HTestimonials = ({ testimonials, onAddClick }) => (
    <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h2 className="text-xl lg:text-2xl font-bold">Testimonials</h2>
            <button
                onClick={onAddClick}
                className="px-4 lg:px-5 py-2 lg:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm lg:text-base"
            >
                + Add
            </button>
        </div>
        <div className="space-y-4">
            {testimonials.map(t => (
                <div key={t.id} className="bg-white p-4 lg:p-5 rounded-lg shadow italic text-gray-700 text-sm lg:text-base">
                    "{t.content || t.message}"
                    <p className="mt-3 font-bold not-italic text-indigo-700 text-sm lg:text-base">
                        — {t.author || t.parent}
                    </p>
                </div>
            ))}
        </div>
    </div>
);