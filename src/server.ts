import {filterImageFromURL, deleteLocalFiles} from './util/util';
import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
//import { requireAuth } from '/exercises/udacity-c2-restapi/src/controllers/v0/users/routes/auth.router';

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
  app.get( "/filteredimage",  ( req: Request, res: Response ) => {
    let imgurl=req.query.image_url;
    if(imgurl===""){
      res.status(404).send("Image url not found!");
    }
    //The image validation code idea was obtained from https://stackoverflow.com/questions/9714525/javascript-image-url-verify
    let imgpattern=/^http.*\.(jpeg|jpg)$/g;
    let checkimage=imgpattern.test(imgurl);
    if(!checkimage){
      res.status(404).send("Image was not found! Please put a correct url with an image.");
    }
    //The filterImage function idea was obtained from the generosity of https://github.com/Adewale-D-A/Udagram-Image-Filter-Project-2/blob/master/src/server.ts
    async function filterImage(){
      try{
        let filtimg= await filterImageFromURL(imgurl);
      //The send file function code idea was obtained from the generosity of https://github.com/Adewale-D-A/Udagram-Image-Filter-Project-2/blob/master/src/server.ts
      return res.status(200).sendFile(filtimg, ()=>{
          deleteLocalFiles([filtimg]);
      });
      }catch(ex){
        //The 422 status code idea was obtained from the generosity of https://github.com/Adewale-D-A/Udagram-Image-Filter-Project-2/blob/master/src/server.ts
        return res.status(422).send("The server can't process your image, sorry.")
      }
      
    }
    filterImage();

  } );
  //! END @TODO1

  //@TODO
//Add an endpoint to GET a specific resource by Primary Key

       // res.status(200).json({project});
  

  
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