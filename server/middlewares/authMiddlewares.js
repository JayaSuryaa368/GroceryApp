import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

 // 1. Get Authorization header
  // 2. Extract token
  // 3. Verify token
  // 4. Attach decoded user
  // 5. next()

export const authMiddleware = async(req,res,next) =>{
    console.log("AUTH HEADER:", req.headers.authorization);
    console.log("in auth middleware")
    try{
        const reqbody={...req};
        console.log("--req -- "+ reqbody );
        const authorizationHeader=req.headers.authorization;
        console.log("---authorization--- "+authorizationHeader);
        if(!authorizationHeader || !authorizationHeader.startsWith("Bearer ")){
            return res.status(401).send({
                success : false,
                message : "Access denied.Missing token"
            })
        }

        const token = authorizationHeader.split(" ")[1];
        // console.log("--- token --- "+token)
        // 4️ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

        // 5 
        req.user = decoded;

        next();
    }
    catch(error){
        return res.status(401).send({
            success : false,
            message  : "Invalid token"
        })
    }
}