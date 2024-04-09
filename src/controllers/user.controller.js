import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async (req, res) => {

    //Steps to register a User : Our Algo

    // 1-  Request for data from the user
    // 2- Validate the form data
    // 3- Check if user already exists
    // 4- Check for avatar, cover Image
    // 5- Upload it on cloudinary
    // 6- Create user object in db
    // 7- Remove password and refresh tokens from res
    // 8- Check for user Creation
    // 9- Return the response


    //All data is coming from the frontend
    const { username, email, fullName, password } = req.body
    console.log(req.body)
    console.log(username)

    // One way of doing it : Do it individually
    // if (!username === "") {
    //     throw new ApiError(400, "This field can't be empty")
    // }

    // -- Professional Approach : Channing(Conditional) operator x ? y : z where z is undefiend

    if ([username, email, fullName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All field are required")
    }

    const userExist = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (userExist) {
        throw new ApiError(409, "User with email or password already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path

    const coverImageLocalPath = req.files?.avatar[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is Required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is Required")
    }

    const user = await User.create({
        fullName,
        password,
        email,
        avatar: avatar?.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase()

    })


    const createdUser = User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Somethng went wrong while registering the user")
    }

    return res.status(200).json(
        new ApiResponse(201, createdUser, "User Register Successfully")
    )




})


export { registerUser }