const biggerTest = async () => {

    
    try {

        const test = async () => {
            return new Promise((resolve, reject) => {
                fetch('https://v2.jokeapi.dev/joke/Any')
                  .then(response => {
                    if (response.ok) {
                      resolve(response.json());
                    } else {
                      reject(new Error(`Request failed with status ${response.status}`));
                    }
                  })
                  .catch(error => {
                    reject(error);
                  });
              });
        }

      
        const res = await test()
            .then(data => {
                console.log('Received data:', data);
                return 200
            })
            .catch(error => {
                console.log('An error occurred:', error.message);
                return 400
            });
        console.log('bout to ret')
        return res
        
    } catch (error) {
        console.log("error")
        return -1
    }

    console.log("end of bigger")



}



const printTest = async () => {
    const res = await biggerTest()
    console.log('Final res: ', res)
}

printTest()

