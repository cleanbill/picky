'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DirectoryItem, Message } from '@/types';
import Selected from './selected';
import MessageDisplay from './MessageDisplay';
import DirectoryNav from './DirectoryNav';
import Folders from './Folders';
import Images from './Images';
import { getUrlPath, moveFiles } from '@/utils/directory';
import FullScreenImageGallery from './FullScreenImageGallery';

export default function DirectoryBrowser() {
  // Function to safely extract 'path' parameter from browser URL
  const getPathFromUrl = useCallback(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      // Ensure path is treated as a single string, or defaults to empty string
      return params.get('path') || '';
    }
    return '';
  }, []);

  const getViewFromUrl = useCallback((): 'browser' | 'gallery' => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') === 'gallery' ? 'gallery' : 'browser';
    }
    return 'browser';
  }, []);

  // 1. STATE MANAGEMENT
  // currentPath is now managed via state and initialized from the URL
  const [currentPath, setCurrentPath] = useState(getPathFromUrl);
  const [contents, setContents] = useState<DirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState<Message | null>(null);

  // CORE NAVIGATION STATE: Manages which view is currently active
  // 1. Initializing viewMode state from the URL
  const [viewMode, setViewMode] = useState<'browser' | 'gallery'>(getViewFromUrl);  // --- View Mode Handlers (Gallery Navigation) ---

  const enterGallery = () => {
    if (images.length > 0) {
      setViewMode('gallery');
      setCurrentPath(getUrlPath(currentPath, 'gallery'));
    }
  };
  const exitGallery = () => {
    setViewMode('browser')
    setCurrentPath(getUrlPath(currentPath, 'browser'));
  };

  // 2. DATA FETCHING BASED ON STATE PATH
  const fetchData = useCallback(async (path: string) => {
    setLoading(true);
    setError("");
    setMessage(null); // Clear previous messages

    try {
      // NOTE: In a real app, you must URL-encode the path: encodeURIComponent(path)
      const res = await fetch(`/api/browse?path=${path}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch directory contents.');
      }

      // FIX: Use functional update of setContents to access prevContents
      // This prevents the infinite loop caused by adding 'contents' to the dependency array of useCallback.
      setContents(prevContents => {
        // Simulate selection persistence: merge existing selection state with new content list
        const updatedContents = data.contents.map((item: DirectoryItem) => {
          // Use prevContents (the old state) for the lookup
          const existing = prevContents.find(c => c.path === item.path);
          return existing ? { ...item, selected: existing.selected } : item;
        });
        return updatedContents;
      });

    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, []); // DEPENDENCY FIX: contents is removed, breaking the infinite loop.

  // 3. useEffect triggers when the path state changes
  useEffect(() => {
    // Fetch data whenever currentPath state updates (via navigation or initial load)
    fetchData(currentPath);

    // Set up popstate listener for back/forward button support
    const handlePopState = () => {
      setCurrentPath(getPathFromUrl());
      setViewMode(getViewFromUrl());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handlePopState);
      }
    };
  }, [currentPath, fetchData, getPathFromUrl]);

  const navigateTo = (folderName: string) => {
    // Construct new path: if at root (''), new path is 'folderName'. Otherwise 'current/folderName'
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(getUrlPath(newPath, viewMode));  // This triggers the useEffect/fetchData
  };

  const navigateUp = () => {
    if (currentPath === '') return;

    // Find the last slash index and take the substring up to it. 
    const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    setCurrentPath(getUrlPath(parentPath, viewMode)); // If it's a top-level folder, this returns '', which is root
  };

  // --- File Manipulation and Selection ---
  const toggleFn = (path: string) => () => {
    setContents(prevContents =>
      prevContents.map(di =>
        di.path === path ? { ...di, selected: !di.selected } : di
      )
    );
  };

  const move = async () => {
    const paths = selected.map((item: DirectoryItem) => item.path);
    if (paths.length === 0) return;
    const message = await moveFiles(paths, currentPath);
    setMessage(message);
    if (message.type == 'success') {
      // Manually trigger a data fetch to refresh the directory contents
      fetchData(currentPath);
    }
  }

  // --- Rendering Logic ---

  const folders = contents.filter(item => item.isDirectory).sort((a, b) => a.name.localeCompare(b.name));
  const images = contents.filter(item => item.isImage).sort((a, b) => a.name.localeCompare(b.name));
  const selected = contents.filter(item => item.selected);

  const isGalleryDisabled = images.length === 0;

  // 4. CONDITIONAL RENDERING
  if (viewMode === 'gallery') {
    return (
      <FullScreenImageGallery
        selected={images}
        toggle={toggleFn}
        exitGallery={exitGallery}
      />
    );
  }


  if (loading) return <div className="text-center p-8 text-xl font-medium text-gray-600">Loading directory...</div>;

  return (
    <div className="p-2 max-w-6xl mx-auto font-sans pr-10">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 border-b pb-2">Picture Browser</h1>

      <MessageDisplay message={message}></MessageDisplay>

      <Selected
        selected={selected}
        move={move}
        enterGallery={enterGallery}
      ></Selected>

      <DirectoryNav currentPath={currentPath} navigateUp={navigateUp}></DirectoryNav>

      {error && <div className="p-4 mb-4 text-red-600 bg-red-100 border border-red-300 rounded-lg font-medium">Error: {error}</div>}

      <Folders folders={folders} navigateTo={navigateTo}></Folders>

      <Images images={images} toggleFn={toggleFn}></Images>

      {folders.length === 0 && images.length === 0 && (
        <div className="text-center p-12 mt-8 border-4 border-dashed border-gray-300 bg-gray-50 rounded-xl">
          <p className="text-xl text-gray-600 font-medium">This folder is empty.</p>
        </div>
      )}

      <Selected
        selected={selected}
        move={move}
        enterGallery={enterGallery}
      ></Selected>

    </div>
  );
}

