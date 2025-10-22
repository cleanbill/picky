import { DirectoryItem } from "@/types"
import ImageGridItem from "./ImageGridItem"


type Props = {
    images: Array<DirectoryItem>,
    toggleFn: Function
}

const Images = ({ images, toggleFn }: Props) => {

    if (images.length < 1) {
        return null;
    }

    return (
        <>
            <h2 className="text-2xl font-semibold mt-8 mb-4 border-b pb-2 text-gray-800">Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((item: DirectoryItem) => (
                    <ImageGridItem
                        key={item.path}
                        itemPath={item.path}
                        name={item.name}
                        selected={item.selected}
                        toggle={toggleFn(item.path)}
                    />
                ))}
            </div>
        </>
    )
}


export default Images