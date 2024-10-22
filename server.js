const express = require('express');
const sql = require('mssql/msnodesqlv8');
const path = require('path'); // Import path module
const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// SQL Server connection configuration
const sqlConfig = {
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=MSI\\SQLEXPRESS;Database=coffee_shop;Trusted_Connection=yes;'
};


// Function to test the SQL Server connection
async function testConnection() {
    try {
        await sql.connect(sqlConfig);  // Use sqlConfig here
        console.log('Connected to SQL Server successfully!');
    } catch (error) {
        console.error('Connection error:', error);
    } finally {
        await sql.close();
    }
}

testConnection();

// Serve the order.html file
app.get('/order.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'order.html'));  // Update the path to your order.html file
});

// Submit order route
app.post('/submit_order', async (req, res) => {
    const { name, email, item, quantity, comments } = req.body;

    try {
        // Connect to SQL Server
        await sql.connect(sqlConfig);  // Use sqlConfig here

        // SQL query to insert the order
        const query = `
            INSERT INTO orders (name, email, item, quantity, comments)
            VALUES (@name, @email, @item, @quantity, @comments)
        `;

        // Prepare and execute the query with parameters
        const request = new sql.Request();
        request.input('name', sql.VarChar, name);
        request.input('email', sql.VarChar, email);
        request.input('item', sql.VarChar, item);
        request.input('quantity', sql.Int, quantity);
        request.input('comments', sql.VarChar, comments);

        const result = await request.query(query);

        console.log('Order submitted successfully:', result);
        res.send('Order submitted successfully');
    } catch (error) {
        console.error('Error submitting order:', error);  // Log the full error
        res.status(500).send('Error submitting order: ' + error.message);  // Send the error message back to the client
    } finally {
        // Close the SQL connection
        await sql.close();
    }
});

// Start the server
app.listen(3002, () => {
    console.log('Server is running on port 3002');
});
