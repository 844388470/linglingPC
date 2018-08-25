import axios from 'axios'

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

const equEdit = (id,data) => (
    axios.put('/devices/'+id,data)
)

const getUsersList = () => (
    axios.get('/users')
)

const getBindList = (id) => (
    axios.get('/users/'+id+'/requests')
)

const deleteBindRecord = (id) => (
    axios.delete('/requests/'+id)
)

export default {
    getzhucheList,
    zhucheAdd,
    zhucheDelete,
    zhucheEdit,
    getEquList,
    equEdit,
    getUsersList,
    getBindList,
    deleteBindRecord
}