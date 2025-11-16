'use client';

import React, { useCallback, useEffect, useState } from 'react';

// Define DirectoryItem type locally for file completeness and portability.
type DirectoryItem = {
    path: string;
    name: string;
    isDirectory: boolean;
    isImage: boolean;
    selected: boolean;
};

const FullScreenImageGallery = ({ selected: items, toggle, exitGallery }: { selected: DirectoryItem[], toggle: (path: string) => () => void, exitGallery: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentItem = items[currentIndex];

    const imageUrl = currentItem ? '/images/' + currentItem.path : '';

    // Toggle logic is memoized to stabilize dependencies
    const handleToggle = useCallback((e: React.MouseEvent | KeyboardEvent) => {
        e.stopPropagation();
        // Access the item based on the latest index
        if (items[currentIndex]) {
            toggle(items[currentIndex].path)();
        }
    }, [currentIndex, items, toggle]);


    const navigate = (direction: 'prev' | 'next') => {
        if (direction === 'next') {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        } else {
            setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                navigate('prev');
            } else if (e.key === 'ArrowRight') {
                navigate('next');
            } else if (e.key === ' ') {
                e.preventDefault(); // Prevent page scroll when space is pressed
                handleToggle(e as unknown as React.MouseEvent);
            } else if (e.key === 'Escape') {
                exitGallery();
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [navigate, handleToggle, exitGallery]);

    // If items (now gallery images) are empty, show back button message
    if (items.length === 0) {
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col z-50 p-4 font-sans items-center justify-center">
                <p className="text-2xl text-white">No images found in this directory.</p>
                <button onClick={exitGallery} className="mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-xl hover:bg-red-700 transition-colors">
                    Back to Browser
                </button>
            </div>
        );
    }


    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col z-50 p-4 font-sans">

            {/* Header and Controls */}
            <div className="flex justify-between items-center text-white p-3 mb-4 bg-gray-800 rounded-lg shadow-xl sticky top-0">

                {/* Back Button */}
                <button
                    onClick={exitGallery}
                    className="flex items-center text-m w-72 font-semibold px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Back to Browser (Esc)
                </button>

                {/* THUMBNAIL PREVIEW BAR */}
                <div className="w-full text-center overflow-x-auto py-2 mb-4 bg-gray-800 rounded-lg shadow-inner">
                    <div className="inline-flex space-x-2 px-3">
                        {items.map((item, index) => (
                            <button
                                key={item.path}
                                onClick={() => setCurrentIndex(index)}
                                className={`
                          relative w-20 h-15 flex-shrink-0 rounded-md overflow-hidden transition-all duration-200 
                          ${index === currentIndex ? 'ring-4 ring-blue-400 ring-offset-2 ring-offset-gray-900 shadow-xl' : ''}
                          ${item.selected ? 'border-2 border-green-400' : 'border-2 border-transparent'}
                          hover:opacity-80
                      `}

                                title={item.name}
                            >
                                {/* Thumbnail Placeholder */}
                                <img
                                    src={'/images/' + item.path}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Selected Checkmark */}
                                {item.selected && (
                                    <div className="absolute top-0 right-0 p-[2px] bg-green-500 rounded-bl-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
                {/* <span className="text-xs font-mono px-4 py-1 bg-gray-700 rounded">
                    {currentIndex + 1} / {items.length}
                </span> */}

                {/* Selection Toggle Button */}
                <button
                    onClick={handleToggle}
                    className={`flex items-center p-2 px-4 w-64 rounded-lg transition-colors shadow-md ${currentItem.selected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    <span className="text-sm font-bold mr-2">
                        {currentItem.selected ? 'Deselect (Space)' : 'Select (Space)'}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 transition-transform ${currentItem.selected ? 'text-white' : 'text-gray-400'}`}>
                        {currentItem.selected ? (
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                        ) : (
                            <path fillRule="evenodd" d="M4 4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm1.25 10.75a.75.75 0 0 1 .75-.75h7a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-7a.75.75 0 0 1-.75-.75v-.5Z" clipRule="evenodd" />
                        )}
                    </svg>
                </button>

            </div>


            {/* Main Image View */}
            <div className={currentItem.selected ? "bg-green-300 max-w-full max-h-full flex flex-col items-center justify-center p-4" : "max-w-full max-h-full flex flex-col items-center justify-center p-4"}>

                {/* Navigation Buttons */}
                <button
                    onClick={() => navigate('prev')}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 p-4 text-white text-4xl font-extrabold rounded-r-lg bg-black bg-opacity-40 hover:bg-opacity-70 transition-all z-10"
                    aria-label="Previous Image"
                >
                    &#10094;
                </button>
                <button
                    onClick={() => navigate('next')}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 p-4 text-white text-4xl font-extrabold rounded-l-lg bg-black bg-opacity-40 hover:bg-opacity-70 transition-all z-10"
                    aria-label="Next Image"
                >
                    &#10095;
                </button>

                {/* Image Content (Dynamic Placeholder) */}
                <button onClick={handleToggle} className="max-w-full max-h-full flex flex-col items-center justify-center p-4">
                    <img
                        src={imageUrl}
                        alt={`Preview of ${currentItem.name}`}
                        className="object-contain max-w-full max-h-full rounded-xl shadow-2xl transition-transform duration-300"
                        style={{ width: '100%', height: '100%', maxWidth: '1200px', maxHeight: '700px' }}
                        // Simple fallback if placeholder service fails
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://placehold.co/1200x800/888888/ffffff?text=Image+Load+Failed`;
                        }}
                        title={imageUrl}
                    />
                    {/* File Name Caption */}
                    <div className="mt-4 p-2 bg-gray-800 rounded-lg text-white text-lg font-mono">
                        {currentItem.name}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default FullScreenImageGallery;