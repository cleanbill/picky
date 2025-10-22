import { DirectoryItem } from "@/types";
import FolderItem from "./FolderItem";

type Props = {
    folders: Array<DirectoryItem>
    navigateTo: (folderName: string) => void;
}

const Folders = ({ folders, navigateTo }: Props) => {

    if (folders.length < 1) {
        return null;
    }

    return (
        <>
            <h2 className="text-2xl font-semibold mt-8 mb-4 border-b pb-2 text-gray-800">Folders</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {folders.map(item => (
                    <FolderItem
                        key={item.path}
                        name={item.name}
                        navigate={navigateTo}
                    />
                ))}
            </div>
        </>

    );
}

export default Folders;