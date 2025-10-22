export type DirectoryItem = {
  /** The name of the file or folder (e.g., "my_photo.jpg" or "vacation_album"). */
  name: string;

  /** The full path relative to the BROWSE_ROOT (public/images). 
   * Used for navigation and image src. (e.g., "folder-a/sub-folder-b/image4.webp") 
   */
  path: string;

  /** A boolean indicating if the item is a directory. */
  isDirectory: boolean;

  /** A boolean indicating if the item is an image file. */
  isImage: boolean;

  selected: boolean;
};

export type Message = {
  type: 'success' | 'error',
  text: string
}
