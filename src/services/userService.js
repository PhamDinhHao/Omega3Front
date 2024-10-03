import axios from '../axios'
const handleLoginAPI = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword })
}
const getAllUser = (inputid) => {
    return axios.get(`api/get-all-users?id=${inputid}`)
}
const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data)
}
const deleteUserService = (userid) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: userid
        }
    })
}
const checkEmail = (inputdata) => {
    return axios.post('/api/check-email', { email: inputdata });
}
const editUserService = (inputdata) => {
    return axios.put('/api/edit-user', inputdata);
}
const editUserServicePassword = (inputdata) => {
    return axios.put('/api/edit-user-password', inputdata);
}
const getAllCodeService = (inputdata) => {
    return axios.get(`/api/allcode?type=${inputdata}`)
}
export { handleLoginAPI, getAllUser, createNewUserService, deleteUserService, editUserService, getAllCodeService, editUserServicePassword, checkEmail }