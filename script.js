document.addEventListener('DOMContentLoaded', () => {
    const totalSalesElement = document.getElementById('total-sales');

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

            const header = rows.shift().split(',');
            const salesIndex = header.indexOf('sales');

            if (salesIndex === -1) {
                throw new Error("'sales' column not found in CSV header.");
            }

            const totalSales = rows.reduce((sum, row) => {
                const columns = row.split(',');
                if (columns.length > salesIndex) {
                    const salesValue = parseFloat(columns[salesIndex]);
                    return sum + (isNaN(salesValue) ? 0 : salesValue);
                }
                return sum;
            }, 0);

            totalSalesElement.textContent = totalSales.toFixed(1);
        })
        .catch(error => {
            console.error('Error fetching or processing CSV data:', error);
            if (totalSalesElement) {
                totalSalesElement.textContent = 'Error';
                totalSalesElement.classList.add('text-danger');
            }
        });
});
