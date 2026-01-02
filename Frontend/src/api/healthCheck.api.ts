import api from './axios'

export const getHealthStatus = async () => {
    const res = await api.get("/healthcheck")

    return res.data
}

