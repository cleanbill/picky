"use client"

import { DirectoryItem } from "@/types";


type Props = {
    selected: Array<DirectoryItem>
    move: Function
}


const Selected = ({ selected, move }: Props) => (

    <div
        // Always render the container. Collapse it when empty using max-height/overflow:hidden
        // Use conditional margin-bottom: mb-8 when visible, mb-0 when collapsed.
        className={`transition-all duration-300 ${selected.length === 0 ? 'max-h-0 overflow-hidden mb-0' : 'mb-8 max-h-80'}`}
    >
        <div className="bg-blue-50 p-4 rounded-lg shadow-inner border border-blue-200">
            <h2 className="text-xl font-bold mb-3 text-blue-300">Selected Items ({selected.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {selected.map(item => (
                    <span key={item.path} className="px-3 py-1 bg-blue-200 text-blue-900 text-sm rounded-full truncate" title={item.name}>
                        {item.name}
                    </span>
                ))}
            </div>
            <button
                onClick={() => move()}
                className='w-full px-4 py-2 bg-blue-300 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors'
            >
                Click to Move {selected.length} Files
            </button>
        </div>
    </div>

);


export default Selected;