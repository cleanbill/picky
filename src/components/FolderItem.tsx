import React from 'react';

interface FolderItemProps {
    name: string;
    navigate: (folderName: string) => void;
}

// Destructure the props and assign the type
const FolderItem: React.FC<FolderItemProps> = ({ name, navigate }) => (
    <div
        className="p-4 border border-blue-200 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50 transition-colors flex items-center"
        onClick={() => navigate(name)}
    >
        {/* ... SVG and span content ... */}
        <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
        <span className="font-semibold text-blue-800">{name}</span>
    </div>
);

export default FolderItem;