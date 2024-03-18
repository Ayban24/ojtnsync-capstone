import React, { useState } from 'react';
import './styles.css';

const DataTable = ({ children, rowCount, itemsPerPage }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate indexes for slicing the items array
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Function to handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Create an array of page numbers based on the total number of items
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(rowCount / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="datatable">
            {children}
            {/* Pagination */}
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <button onClick={() => paginate(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DataTable;
