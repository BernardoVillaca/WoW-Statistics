'use client';

import { useState, useEffect } from "react";
import { FiChevronsRight, FiChevronsLeft } from "react-icons/fi";
import useDebounce from "~/hooks/useDebounce";

const ScrollTab = ({ currentPage, resultsCount, setCurrentPage, resultsPerPage }: { currentPage: number, resultsCount: number, setCurrentPage: React.Dispatch<React.SetStateAction<number>>, resultsPerPage: number }) => {
    const totalPages = Math.ceil(resultsCount / resultsPerPage);
    const [inputValue, setInputValue] = useState(currentPage || '');
    const debouncedInputValue = useDebounce(inputValue, 1000);

    const getDisplayedPages = () => {
        if (currentPage <= 2) {
            return Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1);
        } else if (currentPage >= totalPages - 1) {
            return Array.from({ length: Math.min(5, totalPages) }, (_, i) => totalPages - 4 + i).filter(page => page > 0);
        } else {
            return Array.from({ length: 5 }, (_, i) => currentPage - 2 + i);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (value === 0) return setInputValue(1);
        if (value > totalPages) return setInputValue(totalPages);
        setInputValue(value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setInputValue('');
    };

    useEffect(() => {
        if (debouncedInputValue > 0 && debouncedInputValue <= totalPages) {
            setCurrentPage(debouncedInputValue);
            setInputValue('');
        }
    }, [debouncedInputValue, totalPages, setCurrentPage]);

    return (
        <div className="flex h-10 bg-gray-800 justify-between items-center text-sm rounded-xl text-gray-300">
            {resultsCount !== 0 && currentPage !== 0 && (
                <div className="flex justify-between w-1/2">
                   <div className="items-center flex pl-3">{`Page ${currentPage} from ${resultsCount} characters`}</div>
                    <div className="flex gap-2 items-center">
                        <span>Go to page:</span>
                        <input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={inputValue}
                            onChange={handleInputChange}
                            className="w-10 h-6 px-2 text-center text-gray-300 bg-gray-300 border-none rounded-lg focus:outline-none"
                        />
                    </div>
                </div>
            )}
            <div className="flex gap-1">
                <div className="flex items-center justify-center w-8 h-8">
                    {currentPage > 1 && (
                        <FiChevronsLeft
                            color="gray-300"
                            size={25}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="cursor-pointer"
                        />
                    )}
                </div>
                {getDisplayedPages().map((page, index) => (
                    <div
                        key={index}
                        className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full select-none ${page === currentPage ? 'bg-gray-600 text-white' : 'bg-gray-300 text-black'}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </div>
                ))}
                <div className="flex items-center justify-center w-8 h-8">
                    {currentPage < totalPages && (
                        <FiChevronsRight
                            color="gray-300"
                            size={25}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="cursor-pointer"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ScrollTab;
