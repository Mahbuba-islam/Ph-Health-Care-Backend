
import app from "./app";



const bootstraf = () => {
    try{
   app.listen(5000, () => {
    console.log(`server is running on http://localhost:5000`);

    })
    }
    catch(error){
     console.log(error);
    }
    
}

bootstraf()