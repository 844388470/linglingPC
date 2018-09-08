import axios from 'axios'

const login=(data)=>(
    axios.post('/users/login',data)
)


export default {
    login,
}