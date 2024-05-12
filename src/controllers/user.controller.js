import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

//We think that we might gonna need this code lot of times so writing here!
// -Pass userId and generate both tokens
// -Store the refresh token into the user database
// -Save it with validateBeforeSave parameter bocz to save this mongoose needed the password field also but we don't have that field.So this parameter will bypass that z+ security.
// -Return the accessToken and refreshToken 
const generateAccessAndRefreshTokens = async (userId) => {

    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
}

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
    // console.log(req.body)
    // console.log(username)

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
        throw new ApiError(409, "User with email or username already exist")
    }

    console.log(req.files)

    const avatarLocalPath = req.files?.avatar[0]?.path

    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    //Checking if we get the coverImage or not but why?"TypeError: Cannot read properties of undefined" bcoz in earlier code we're not sure that we are getting the path or not so we're doing it mannually using if condition.
    let coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

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


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Somethng went wrong while registering the user")
    }

    return res.status(200).json(
        new ApiResponse(201, createdUser, "User Register Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    /* 
        -req body => data retrive
        -username or email => fetch
        -find user
        -password check
        -generate access and refresh tokens

        -send cookies(we send tokens in cookies? ig)
        -res => successfully login
    */

    //req body => data
    const { username, email, password } = req.body

    //checking if we get any username or email
    if (!username || !email) {
        throw new ApiError(400, "username or email is required")
    }

    //finding user => Learning more about mongodb operators
    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    //Checking user
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    //checking password validation
    const isPasswordValid = await user.isPasswordCorrect(password)

    //password is not correct
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    //Generated access and refresh Tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    //Calling db one more time bcoz above user obj in line 138 has empty refresh token, So either you can update that or just call db one more time(expensive op tho) and pass this thing when ever you need it
    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken")

    //Sending cookies,Security steps Now this cookie is modifiable by sever only you can't change it by frontend
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken",
            accessToken, options
        )
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken,
                    refreshToken
                },
                "User logged In successfully"
            )
        )


})

const logoutUser = asyncHandler(async (req, res) => {
    //Remove Cookies
    //Remove refresh Tokens4

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))




})






export {
    registerUser,
    loginUser,
    logoutUser,
}