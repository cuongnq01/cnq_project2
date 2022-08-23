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
  function validateURL(image_url: string) {
    const image_url_regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpeg|jpg|gif|png|svg)/
    return image_url.match(image_url_regex);
  }

  app.get( "/filteredimage", async ( req, res ) => {
    // 1. validate the image_url query
    var image_url = req.query.image_url;
    if (!image_url) {
      res.status(400).send("Image URL is not being entered");
      return;
    }
    try {
    var is_valid = validateURL(image_url);
    if(is_valid){
      // 2. call filterImageFromURL(image_url) to filter the image
      var result_url = await filterImageFromURL(image_url);

      // 3. send the resulting file in the response
      res.sendFile(result_url, function (error) {
        if (error) {
          res.status(400).send("Image URL is wrong, please check!")
        } else {
          // 4. deletes any files on the server on finish of the response
          deleteLocalFiles([result_url]);
        }
      });
    }
    else {
      res.status(404).send('Image URL was not found')
    }
  } catch {
    res.status(400).send("Image URL is wrong, please check!");
}
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