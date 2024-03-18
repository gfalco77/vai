import axios from 'axios';

export async function fetchProducts() {
    try {
        const response = await axios.get('https://9euslc53h1.execute-api.eu-west-2.amazonaws.com/dev/products', {
            // Add any additional configuration options here
        });

        console.log('Data:', response.data);
        // Process the data as needed
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

