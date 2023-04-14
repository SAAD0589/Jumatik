import axios from 'axios';

export default async function  AdsData(){

  // Define the URL of the API endpoint
  const url = `${process.env.REACT_APP_API}/ads/admin/allAds`;

  // Make the Axios GET request to retrieve the data
  return axios.get(url,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  )
    .then((response) => {
      // Extract the data from the response
      const data = response.data;

      // Map the data into a new array of objects
      const newData = data?.map(item => {
        return {
          "nom": item.name,
          "status": item.status,
          "date": item.CreatedAt,
          "annonceur": item.firstName + '' + item.lastName
        };
      });

      // Convert the newData array to JSON format and return it
      return JSON.stringify(newData);
    })
    .catch((error) => {
      console.error(error);
    });
}