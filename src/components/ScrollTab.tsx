'use client';

import { useState, useEffect } from "react";
import { FiChevronsRight, FiChevronsLeft } from "react-icons/fi";
import useDebounce from "~/utils/hooks/useDebounce";
import { useSearch } from "./Context/SearchContext";
import { updateURL } from "~/utils/helper/updateURL";

const ScrollTab = ({ resultsPerPage }: { resultsPerPage: number }) => {
    const { resultsCount, currentPage, setCurrentPage } = useSearch();
    const [inputValue, setInputValue] = useState<string | number>(currentPage ?? '');
    const totalPages = Math.ceil(resultsCount / resultsPerPage);
    const debouncedInputValue = useDebounce(Number(inputValue), 1000);

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
        const urlParams = new URLSearchParams(window.location.search);
        const initialPage = parseInt(urlParams.get('page') ?? '1', 10);
        setCurrentPage(initialPage);
        setInputValue(initialPage);
    }, [setCurrentPage]);

    useEffect(() => {
        if (debouncedInputValue > 0 && debouncedInputValue <= totalPages) {
            setCurrentPage(debouncedInputValue);
            updateURL('page', debouncedInputValue.toString(), true);
            setInputValue('');
        }
    }, [debouncedInputValue, setCurrentPage, totalPages]);

    useEffect(() => {
        if (currentPage) {
            updateURL('page', currentPage.toString(), false);
        }
    }, [currentPage]);

    return (
        <div className="flex h-10 bg-secondary-light_black justify-between items-center text-sm rounded-xl">
            {resultsCount !== 0 && currentPage !== 0 && (
                <div className="flex justify-between w-1/2">
                    <div className="items-center flex pl-3">{`Page ${currentPage} - ${totalPages} from ${resultsCount} characters`}</div>
                    <div className="flex gap-2 items-center">
                        <span>Go to page:</span>
                        <input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={inputValue}
                            onChange={handleInputChange}
                            className="w-14 h-6 px-2 text-center text-black bg-secondary-gray border-none rounded-lg focus:outline-none"
                        />
                    </div>
                </div>
            )}
            {resultsCount !== 0 && currentPage !== 0 && (
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
                            className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-full select-none ${page === currentPage ? 'bg-secondary-navy text-white' : 'bg-secondary-gray text-primary-dark'}`}
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
            )}
        </div>
    );
};

export default ScrollTab;
