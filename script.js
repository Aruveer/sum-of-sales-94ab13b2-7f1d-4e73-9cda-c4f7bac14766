document.addEventListener('DOMContentLoaded', () => {
    const totalSalesElement = document.getElementById('total-sales');
    const productSalesTableBody = document.querySelector('#product-sales tbody');

    fetch('data.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.text();
        })
        .then(csvText => {
            const rows = csvText.trim().split('\n');
            if (rows.length < 2) {
                throw new Error('CSV file is empty or has only a header.');
            }
            const headers = rows[0].split(',');
            const priceIndex = headers.indexOf('Price');
            const productIndex = headers.indexOf('Product');

            if (priceIndex === -1) {
                throw new Error('CSV file must have a "Price" column.');
            }
            if (productIndex === -1) {
                throw new Error('CSV file must have a "Product" column.');
            }

            let totalSales = 0;
            const productSales = {};

            for (let i = 1; i < rows.length; i++) {
                const values = rows[i].split(',');
                if (values.length > priceIndex && values.length > productIndex) {
                    const price = parseFloat(values[priceIndex]);
                    const productName = values[productIndex];

                    if (!isNaN(price) && productName) {
                        totalSales += price;
                        productSales[productName] = (productSales[productName] || 0) + price;
                    }
                }
            }

            // Update total sales display
            totalSalesElement.textContent = `$${totalSales.toFixed(2)}`;

            // Populate product sales table
            productSalesTableBody.innerHTML = ''; // Clear existing rows
            for (const [productName, sales] of Object.entries(productSales)) {
                const row = document.createElement('tr');
                
                const productCell = document.createElement('td');
                productCell.textContent = productName;
                row.appendChild(productCell);

                const salesCell = document.createElement('td');
                salesCell.textContent = `$${sales.toFixed(2)}`;
                row.appendChild(salesCell);

                productSalesTableBody.appendChild(row);
            }

        })
        .catch(error => {
            console.error('Error fetching or parsing CSV data:', error);
            totalSalesElement.textContent = 'Error';
            totalSalesElement.classList.add('text-danger');
            const errorRow = `<tr><td colspan="2" class="text-danger text-center">${error.message}</td></tr>`;
            productSalesTableBody.innerHTML = errorRow;
        });
});