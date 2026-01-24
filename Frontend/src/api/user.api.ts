import api from './axios'

type UserReg = {
    fullname: string,
    email: string,
    username: string,
    password: string,
    // avatar: File | null,
    // coverImage: File | null,
}

const userRegister = async (details: UserReg) => {
    // const formData =  new FormData();

    // formData.append("fullname", details.fullname)
    // formData.append("email", details.email)
    // formData.append("username", details.username)
    // formData.append("password", details.password)

    // if (details.avatar) {
    //     formData.append("avatar", details.avatar)
    // }
    // if (details.coverImage) {
    //     formData.append("coverImage", details.coverImage)
    // }

    const res = await api.post("/users/register", details, {
        // headers: {
        //     "Content-Type": "multipart/form-data",
        // },
    })

    return res
}

type UserLog = {
    email: string,
    password: string
}

const userLogin = async (details: UserLog) => {

    const res = await api.post("/users/login", details);
    return res.data
}

const userLogout = async () => {

    const res = await api.post("/users/logout")
    return res.data    
}

type passChang = {
    oldPassword: string,
    newPassword: string,
    confPassword: string
}

const userPasswordChange = async (params: passChang) => {
    
    const res = await api.post("/change-password", params)
    return res.data
}

const currentUser = async () => {

    const res = await api.get("/users/current-user")
    return res.data
}

type accountUpdateDetail = {
    fullname?: string,
    email?: string
}

const updateAccountDetails = async (payload: accountUpdateDetail) => {

    const res = await api.patch("/update-account", payload)
    return res.data
}

const updateAvatar = async (avatarImg?: File) => {
    
    const res = await api.patch("/avatar", avatarImg)
    return res.data
}

const updateCoverImage = async (coverImg?: File) => {
    
    const res = await api.patch("/cover-image", coverImg)
    return res.data
}

const getChannelProfile = async (username: string) => {
    
    const res = await api.get(`/c/${username}`)
    return res.data
}

const userWatchHistory = async () => {
    
    const res = await api.get("/history")
    return res.data
}


export {
    userRegister,
    userLogin,
    userLogout,
    userPasswordChange,
    currentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    getChannelProfile,
    userWatchHistory,
}