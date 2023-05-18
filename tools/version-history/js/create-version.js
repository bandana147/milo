export function createVersion() {
  fetch(
    "https://{site_url}/_api/web/lists/getByTitle('{list_title}')/items({item_id})/File/CheckOut()",
    {
      method: 'POST',
      headers: {
        'X-RequestDigest': '{digest_value}', // Add the appropriate request digest value
        // Add any additional headers if required
      }
    }
  )
    .then(response => {
      if (response.ok) {
        // The file has been checked out successfully
        return fetch(
          "https://{site_url}/_api/web/lists/getByTitle('{list_title}')/items({item_id})/File/CheckIn(comment='Version created',checkintype=1)",
          {
            method: 'POST',
            headers: {
              'X-RequestDigest': '{digest_value}', // Add the appropriate request digest value
              // Add any additional headers if required
            }
          }
        );
      } else {
        throw new Error('Failed to check out the file.');
      }
    })
    .then(response => {
      if (response.ok) {
        // The new version has been created successfully
        // Handle the response or perform additional operations if needed
      } else {
        throw new Error('Failed to check in the file.');
      }
    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error(error);
    });
  
}
