// affinda api handling route
export default async function handler(req, res) {
    const API_KEY = process.env.AFFINDA_API_KEY;  // Access the API key from the environment variable
    const apiUrl = 'https://api.affinda.com/v3/documents';  // Example API URL; replace with actual API endpoint
  
    try {
      // Example of how to make a GET request with fetch
      const response = await fetch(apiUrl, {
        method: 'GET',  // or 'POST', depending on the API
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
  
      // Check if the request was successful (status code 200)
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      // If successful, parse the response as JSON
      const data = await response.json();
  
      // Send the data as a response
      res.status(200).json(data);
    } catch (error) {
      // Handle any errors that occurred during the request
      res.status(500).json({ error: 'Failed to connect to Affinda API', details: error.message });
    }
  }
  