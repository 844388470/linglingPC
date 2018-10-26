import axios from 'axios'

axios.defaults.headers['jwt'] = sessionStorage['token']

const login=(data)=>(
    axios.post('/users/login',data)
)

const getzhucheList = (imei) => (
    axios.get(`/deviceInfos?imei=${imei}`)
)

const getzhucheListPagination = (data) => (
    axios.post('/deviceInfos/pagination',data)
)

const zhucheAdd = (data) =>(
    axios.post('/deviceInfos',data)
)

const zhucheEdit = (id,data) =>(
    axios.put('/deviceInfos/'+id,data)
)

const zhucheDelete=(id)=>(
    axios.delete('/deviceInfos/'+id)
)

const getEquList = (imei) => (
    axios.get(`/devices?imei=${imei}`)
)

const getEquListPagination = (data) => (
    axios.post('/devices/pagination',data)
)

const equAdd = (data) =>(
    axios.post('/devices',data)
)

const equEdit = (id,data) => (
    axios.put('/devices/'+id,data)
)

const equDelete=(id)=>(
    axios.delete('/devices/'+id)
)

const getUsersList = (nickname) => (
    axios.get(`/users?nickname=${nickname}`)
)

const getUsersListPagination = (data) => (
    axios.post('/users/pagination',data)
)

const userAdd = (data) =>(
    axios.post('/users',data)
)

const userRegister = (data) =>(
    axios.post('/users/register',data)
)

const userEdit = (id,data) => (
    axios.put('/users/'+id,data)
)

const userDelete=(id)=>(
    axios.delete('/users/'+id)
)

const getBindList = (id) => (
    axios.get('/users/'+id+'/requests')
)

const deleteBindRecord = (id) => (
    axios.delete('/requests/'+id)
)

const getUserCount = () => (
    axios.get('/users/count')
)

const getUserCounts = (day) => (
    // axios.get(`/users/count`)
    axios.get(`/users/count?days=${day.day}`)
)

const getEquCount = () => (
    axios.get('/devices/count')
)

const getEquCounts = (day) => (
    axios.get(`/devices/count?days=${day.day}`)
)

const getEquCity = () => (
    axios.get('/devices/count/region',)
)

const getEquModel = () => (
    axios.get('/devices/count/model',)
)

const getHistory = (id,data) => (
    axios.get(`/devices/${id}/positions?startTime=${data.startTime}&endTime=${data.endTime}`)
)

const getLocation = (id) => (
    axios.get(`/devices/${id}/latest`)
)

export default {
    login,
    getzhucheList,
    getzhucheListPagination,
    zhucheAdd,
    zhucheEdit,
    zhucheDelete,
    getEquList,
    getEquListPagination,
    equAdd,
    equEdit,
    equDelete,
    getUsersList,
    getUsersListPagination,
    userAdd,
    userRegister,
    userEdit,
    userDelete,
    getBindList,
    deleteBindRecord,
    getUserCount,
    getUserCounts,
    getEquCount,
    getEquCounts,
    getEquCity,
    getEquModel,
    getHistory,
    getLocation
}