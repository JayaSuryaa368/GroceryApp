import jwt from "jsonwebtoken"

export const isUser = async (req,res,next)=>{
    try{
        const role=req.user.role;
        console.log("---in user check middleware")
        if(role !== "user"){
            console.log("still user is allowed")
           return res.status(401).send(
            {
                success : false,
                message : "You are not allowed to proceed further"
            }
        )
        }

        console.log("---proceeding next---")
        next();
        
    }
    catch(error){
        return res.status(500).send(
            {
                success : false,
                message : "Internal server error try later"
            }
        )
    }
}

export const isStore =async (req,res,next)=>{
    try{
        console.log("in store role middleware");
        const role = req.user?.role;
        console.log("in store role middleware");
        console.log("role in stire is ",role)
        if(role !== "store"){
             console.log("in if store--- role middleware");
             return res.status(401).send(
            {
                success : false,
                message : "You are not allowed to proceed further"
            }
        )
        }
        console.log("reached before role check next")
        next();
    }
    catch(error){
         return res.status(501).send(
            {
                success : false,
                message : "Internal server error try later"
            }
        )
    }
}

export const isAdmin =async (req,res,next)=>{
    try{
        const role = req.user.role;
        console.log("reached role admin middleware")
        if(role !== "admin"){
             return res.status(401).send(
            {
                success : false,
                message : "Access Denied"
            }
        )
        }
        next();
    }
    catch(error){
         return res.status(500).send(
            {
                success : false,
                message : "Internal server error try later"
            }
        )
    }
}