import axios from 'axios'

const login=(data)=>(
    axios.post('/users/login',data)
)

const userEdit = (id,data) => (
    axios.put('/users/'+id,data)
)

export default {
    login,
    userEdit
}