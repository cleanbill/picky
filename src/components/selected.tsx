"use client"

import { DirectoryItem } from "@/types";


type Props = { selected: DirectoryItem[], move: () => Promise<void>, enterGallery: () => void }

const Selected = ({ selected, move, enterGallery }: Props) => (
    <>
        <div
            className={`transition-all duration-300 ${selected.length === 0 ? 'max-h-0 overflow-hidden mb-0' : 'mb-8 max-h-80'}`}
        >
            <div className="bg-blue-50 p-4 rounded-lg shadow-inner border border-blue-200">
                <h2 className="text-xl font-bold mb-3 text-blue-800">Selected Items ({selected.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {selected.map(item => (
                        <span key={item.path} className="px-3 py-1 bg-blue-200 text-blue-900 text-sm rounded-full truncate" title={item.name}>
                            {item.name}
                        </span>
                    ))}
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={move}
                        className='flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors'
                    >
                        Click to Move {selected.length} Files
                    </button>

                </div>
            </div>
        </div>
        <button
            onClick={enterGallery}
            className='w-full mb-10 px-4 py-2 font-semibold rounded-lg shadow-md transition-colors bg-green-500 text-white hover:bg-green-600'
        >
            View in Gallery
        </button>
    </>
);




export default Selected;