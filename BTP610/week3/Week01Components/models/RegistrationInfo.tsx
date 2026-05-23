export default class RegistrationInfo {
    name: string
    email: string
    program: string
    tution: string
    campuses: string[]

    constructor(
        name: string,
        email: string,
        program: string,
        tution: string,
        campuses: string[]
    ) {
        this.name = name
        this.email = email
        this.program = program
        this.tution = tution
        this.campuses = campuses
    }
}