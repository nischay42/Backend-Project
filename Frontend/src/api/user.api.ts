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
    const res = await api.post("/users/register", details)
    
    return res.data
}

type UserLog = {
    email?: string,
    username?: string,
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
    confirmPassword: string
}

const userPasswordChange = async (params: passChang) => {
    
    const res = await api.post("/users/change-password", params)
    return res.data
}

const currentUser = async () => {

    const res = await api.get("/users/current-user")
    return res.data
}

type accountUpdateDetail = {
    fullname: string,
    email: string,
    username: string
}

const updateAccountDetails = async (payload: accountUpdateDetail) => {

    const res = await api.patch("/users/update-account", payload)
    return res.data
}

const updateAvatar = async (avatarFile: File) => {
    const formData = new FormData()
    formData.append('avatarImage', avatarFile)

    const res = await api.patch("/users/avatar", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return res.data
}

const updateCoverImage = async (coverImageFile: File) => {
    const formData = new FormData()
    formData.append('coverImage', coverImageFile)
    
    const res = await api.patch("/users/cover-image", formData, {
        headers: {
            'Content-Type' : 'multipart/form-data'
        }
    })
    return res.data
}

const getChannelProfile = async (username: string) => {
    
    const res = await api.get(`/users/c/${username}`)
    return res.data
}

const userWatchHistory = async () => {
    
    const res = await api.get("/users/history")
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