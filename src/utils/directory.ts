import { Message } from "@/types";

// Builds a new URL and updates history and state
const getUrlPath = (newPath: string, currentViewMode: 'browser' | 'gallery') => {
    let newUrl = window.location.pathname;
    const params = new URLSearchParams();

    // Set path parameter
    if (newPath) {
        params.set('path', newPath);
    }

    // Set view parameter only if it's 'gallery'
    if (currentViewMode === 'gallery') {
        params.set('view', 'gallery');
    }

    const search = params.toString();
    if (search) {
        newUrl += `?${search}`;
    }

    if (typeof window !== 'undefined') {
        window.history.pushState(null, '', newUrl);
    }
    return newPath;
}


const moveFiles = async (paths: string[], currentPath: string): Promise<Message> => {
    try {
        const response = await fetch('/api/move-files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Use currentPath from state
                'X-Current-Path': currentPath
            },
            body: JSON.stringify({ paths }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP Error ${response.status}`);
        }

        // Successful move: Display message and manually re-fetch data for the current path
        return { type: 'success', text: `${paths.length} files moved successfully.` };

    } catch (error) {
        console.error('Failed to move files:', error);
        return { type: 'error', text: `Failed to move files: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
};


export { getUrlPath, moveFiles }