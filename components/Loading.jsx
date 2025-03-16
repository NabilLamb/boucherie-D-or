import React from 'react';

const Loading = () => {
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-orange-300 border-gray-200"></div>
        </div>
    );
};

export default Loading;