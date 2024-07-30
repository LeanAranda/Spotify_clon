  
  fetch('https://audius-discovery-3.theblueprint.xyz/v1/tracks/2P4dy/stream?app_name=EXAMPLEAPP',
    {
      method: 'GET'
    
    })
    .then(function(res) {
        return res.json();
    }).then(function(body) {
        console.log(body);
    });