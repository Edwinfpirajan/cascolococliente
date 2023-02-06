import axios from "axios"

export default class PersonaService {

    baseUrl = "http://localhost:3001/persona/api/"

    async getAll(){
        const { data } = await axios.get(this.baseUrl + "all")
        return data
    }
}


