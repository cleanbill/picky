import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';


const listDirectory = async (directoryPath: string) => {
    try {
        // fs.readdir returns a Promise that resolves to an array of file/directory names.
        const files: string[] = await fs.readdir(directoryPath);

        console.log(`Contents of ${directoryPath}:`);
        files.forEach(file => {
            console.log(file);
        });
    } catch (error) {
        // Ensure you handle potential errors, such as the directory not existing.
        console.error(`Error reading directory ${directoryPath}:`, error);
    }
}

export async function POST(request: Request) {
    try {
        const { paths } = await request.json() as { paths: string[] };

        if (!paths || !Array.isArray(paths) || paths.length === 0) {
            return NextResponse.json({ message: 'No file paths provided.' }, { status: 400 });
        }

        const successfulMoves: string[] = [];
        const failedMoves: { path: string, error: string }[] = [];

        // The first path is used to determine the base directory for the new subdirectory
        const firstPath = path.join('public/images', paths[0]);
        const baseDir = path.dirname(firstPath); // e.g., 'path/to/files'

        // Create the new subdirectory name and ensure it exists
        const newSubDir = path.join(baseDir, path.basename(baseDir) + '_picked'); // e.g., 'path/to/files/files_picked'
        console.log('Creating ' + newSubDir);
        await fs.mkdir(newSubDir, { recursive: true });
        listDirectory(baseDir);

        for (const filePath of paths) {
            try {
                const fileName = path.basename(filePath); // e.g., 'image1.jpg'

                // Construct the new path: newSubDir + fileName
                // e.g., 'path/to/files/files_picked/image1.jpg'
                const newPath = path.join(newSubDir, fileName);
                const oldPath = path.join('public/images', filePath);

                // Rename/Move the file
                await fs.rename(oldPath, newPath);
                successfulMoves.push(newPath);

            } catch (error: any) {
                // Log individual file errors but continue with the rest of the list
                console.error(`Failed to move file public/images/${filePath}:`, error.message);
                failedMoves.push({ path: filePath, error: error.message });
            }
        }

        return NextResponse.json({
            message: 'Processing complete',
            successful: successfulMoves,
            failed: failedMoves
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}