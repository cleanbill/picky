"use client"

type Props = {
    currentPath: string
    navigateUp: Function
}


const DirectoryNav = ({ currentPath, navigateUp }: Props) => {

    return (<div className="flex items-center mb-6 p-4 bg-gray-100 rounded-lg shadow-sm" >
        <span className="font-mono text-base text-gray-700" >
            <span className="font-bold text-gray-900" > Path: </span> /images / {currentPath || 'root'
            }
        </span>
        {
            currentPath && (
                <button
                    onClick={() => navigateUp()}
                    className="ml-4 px-3 py-1 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1" >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Up
                </button>
            )
        }
    </div>
    );
}

export default DirectoryNav;