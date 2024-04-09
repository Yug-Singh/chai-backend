// Using Promises

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))

    }
}

export { asyncHandler };





// USing try catch

// Explaination pov
// const asyncHandler=()=>{}
// const asyncHandler=(fn)=>{()=>{}}
// const asyncHandler=(fn)=>async()=>{}



// const asyncHandler = (fn)=>async(req,res,next)=>{
//     try{
//         await fn(req,res,next)
//     }catch(err){
//         res.status((err.code || 500).json({
//             success : false,
//             message : err.message
//         }))
//     }
// }




