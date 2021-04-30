import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  // QL
  // Example: {{host}}/filteredimage?image_url={{URL}}
  app.get("/filteredimage/", async (req, res) => {
    // Get the image url passed in from the GET.
    let { image_url } = req.query;

    // Check image url is provided.
    if ( !image_url ) {
      return res.status(422).send('image_url not provided');
    }

    // Check if image url is a valid url.
    try {
      let url = new URL(image_url);
    } catch (err) {
      let customError = 'Invalid image_url or image_url not provided.';
      console.log(`${customError} ${err}.`)
      return res.status(422).send(`${customError}`);
    }

    // Pass image url to the filter function for processing.
    await filterImageFromURL(image_url)
    .then( (filteredImgPath) => {
        // Get the result "filteredImgPath" returned from the image filter function 
        // and call sendFile to send the file to the client (i.e. browser)
        // and pass in a call back function to delete the file after the send is done.
        res.status(200).sendFile(filteredImgPath, () => {deleteLocalFiles([filteredImgPath]);});
    } )
    .catch( (error) => {
      let customErr = 'Invalid image_url.'; 
      res.status(422).send(`${customErr} Make sure the image_url provided is pointing to an image that exists.`);
      console.log(`${customErr} ${error}.`);
    } )
  });
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();