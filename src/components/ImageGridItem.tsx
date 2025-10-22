import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface ImageGridItemProps {
    itemPath: string;

    name: string;

    selected: boolean;

    toggle: Function;
}

const ImageGridItem: React.FC<ImageGridItemProps> = ({ itemPath, name, selected, toggle }) => {

    const [highlight, setHighlight] = useState(selected);

    const selection = () => {
        setHighlight(!highlight);
        toggle();

    }
    return (<button onClick={() => selection()} className={highlight ? "bg-green-500 bg-red p-4 rounded-lg shadow-sm flex flex-col items-center" : "p-4 rounded-lg shadow-sm flex flex-col items-center"}>
        <Image
            // Assuming images are served from the public/images directory
            src={`/images/${itemPath}`}
            alt={name}
            width={300}
            height={200}
            className="object-cover w-full h-auto rounded"
            priority={false}
        />
        <p className="mt-2 text-sm font-medium text-gray-700 truncate w-full text-center">
            {name}
        </p>
    </button >)
};

export default ImageGridItem;