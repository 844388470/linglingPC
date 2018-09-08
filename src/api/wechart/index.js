import axios from 'axios'

axios.defaults.headers['jwt'] = sessionStorage['token']

const login=(data)=>(
    axios.post('/users/login',data)
)

const getzhucheList = () => (
    axios.get('/deviceInfos')
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

const getEquList = () => (
    axios.get('/devices')
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

const getUsersList = () => (
    axios.get('/users')
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
    axios.get('/users/count',day)
)

const getEquCount = () => (
    axios.get('/devices/count')
)

const getEquCounts = (day) => (
    axios.get('/devices/count',day)
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

export default {
    login,
    getzhucheList,
    zhucheAdd,
    zhucheEdit,
    zhucheDelete,
    getEquList,
    equAdd,
    equEdit,
    equDelete,
    getUsersList,
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
    getHistory
}