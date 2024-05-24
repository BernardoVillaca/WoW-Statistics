'use client';

import { useState } from "react";
import { FiChevronsRight, FiChevronsLeft } from "react-icons/fi";

const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

const ScrollTab = () => {
    const [currentPage, setCurrentPage] = useState(1)

    const getDisplayedPages = () => {
        if (currentPage <= 2) {
            return pages.slice(0, 3);
        } else if (currentPage >= pages.length - 1) {
            return pages.slice(pages.length - 5);
        } else {
            return pages.slice(currentPage - 3, currentPage + 2);
        }
    };

    return (
        <div className="flex h-8 bg-gray-600 justify-between items-center ">
            <div>Displaying x results</div>
            <div className="flex items-center">
                <div className="flex items-center">
                    {currentPage > 1 && (
                        <FiChevronsLeft
                            color="black"
                            size={25}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="cursor-pointer"
                        />
                    )}
                    {getDisplayedPages().map((page, index) => (
                        <div
                            key={index}
                            className={`w-8 h-8 flex items-center justify-center cursor-pointer select-none ${page === currentPage ? 'bg-black text-white' : 'bg-white text-black'}`}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </div>
                    ))}
                    {currentPage < pages.length -1  && (
                        <FiChevronsRight
                            color="black"
                            size={25}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="cursor-pointer"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ScrollTab
