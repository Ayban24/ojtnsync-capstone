	import React, { useState } from 'react';
	import './styles.css';

	const InitDataTable = ({ children, rowCount, itemsPerPage, header, data }) => {
		console.log("data: ",data)
		const [currentPage, setCurrentPage] = useState(1);
		const [filteredTable, setFilteredTable] = useState(data)

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

		

		const handleFilter = (e) => {
			const filteredData = data.filter((row) => (
			  row.some((col) => (
				col.toLowerCase().includes(e.target.value.toLowerCase())
			  ))
			));
			
			// Now 'filteredData' contains only rows where at least one column contains the filter value
			console.log(filteredData);
			setFilteredTable(filteredData)
			
			// If you need to update the state or perform further actions with the filtered data, do it here
		  };
		  
		  

		return (
			<div className="datatable">
				<input onChange={handleFilter} />
				<table>
					<thead>
						<tr>
							{header.map((col, colIndex) => (
								<th key={colIndex}>{col}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{filteredTable.map((row, rowIndex) => (
							<tr key={rowIndex}>
							{row.map((col, colIndex) => (
								<td key={colIndex}>{col}</td>
							))}
							</tr>
						))}
					</tbody>
				</table>
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

	export default InitDataTable;
