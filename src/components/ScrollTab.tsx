'use client';

import { FiChevronsRight, FiChevronsLeft } from "react-icons/fi";

const ScrollTab = ({ currentPage, resultsCount, setCurrentPage, resultsPerPage }: { currentPage: number, resultsCount: number, setCurrentPage: React.Dispatch<React.SetStateAction<number>>, resultsPerPage: number }) => {
    const totalPages = Math.ceil(resultsCount / resultsPerPage);

    const getDisplayedPages = () => {
        if (currentPage <= 2) {
            return Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1);
        } else if (currentPage >= totalPages - 1) {
            return Array.from({ length: Math.min(5, totalPages) }, (_, i) => totalPages - 4 + i).filter(page => page > 0);
        } else {
            return Array.from({ length: 5 }, (_, i) => currentPage - 2 + i);
        }
    };

    return (
        <div className="flex h-8 bg-gray-600 justify-between items-center">
            {resultsCount !== 0 && currentPage !== 0 && (
                <div>{`Page ${currentPage} from ${resultsCount} characters`}</div>
            )}

            <div className="flex gap-1">
                <div className="flex items-center justify-center w-8 h-8">
                    {currentPage > 1 && (
                        <FiChevronsLeft
                            color="black"
                            size={25}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="cursor-pointer"
                        />
                    )}
                </div>
                {getDisplayedPages().map((page, index) => (
                    <div
                        key={index}
                        className={`w-8 h-8 flex items-center justify-center cursor-pointer select-none ${page === currentPage ? 'bg-black text-white' : 'bg-white text-black'}`}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </div>
                ))}
                <div className="flex items-center justify-center w-8 h-8 ">
                    {currentPage < totalPages && (
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

export default ScrollTab;
