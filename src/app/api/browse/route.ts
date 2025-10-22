import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// Define the root directory to browse (relative to the project root for safety)
// You MUST ensure the path is safe and confined to the public folder for security.
const BROWSE_ROOT = path.join(process.cwd(), 'public', 'images');

/**
 * Helper to determine if a file is an image
 */
const isImage = (fileName: string) => {
    return /\.(jpe?g|png|gif|webp)$/i.test(fileName);
};

export async function GET(request: { url: string | URL; }) {
    try {
        const { searchParams } = new URL(request.url);
        // Get the requested path from the URL query, e.g., /api/browse?path=folder/subfolder
        const requestedPath = searchParams.get('path') || '';

        // Sanitize the path to prevent directory traversal attacks (VERY IMPORTANT)
        const absolutePath = path.resolve(path.join(BROWSE_ROOT, requestedPath));

        // Ensure the requested path is still within the designated root
        if (!absolutePath.startsWith(BROWSE_ROOT)) {
            return NextResponse.json({ error: 'Directory traversal attempt detected.' }, { status: 403 });
        }

        const entries = await fs.readdir(absolutePath, { withFileTypes: true });

        const contents = entries.map((dirent) => {
            const entryPath = path.join(requestedPath, dirent.name);
            const isDir = dirent.isDirectory();
            const isImg = isImage(dirent.name);

            return {
                name: dirent.name,
                path: entryPath.replace(/\\/g, '/'), // Normalize path separators for URL/web use
                isDirectory: isDir,
                isImage: isImg,
            };
        });

        return NextResponse.json({
            currentPath: requestedPath.replace(/\\/g, '/'),
            contents: contents,
        });
    } catch (error) {
        console.error('File system error:', error);
        return NextResponse.json({ error: 'Failed to read directory.' }, { status: 500 });
    }
}