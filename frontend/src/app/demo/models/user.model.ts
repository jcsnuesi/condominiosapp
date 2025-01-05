export class User {
    constructor(
        public avatar: string,
        public company: string,
        public rnc: string,
        public phone: string,
        public phone2: string,
        public street_1: string,
        public street_2: string,
        public city: string,
        public state: string,
        public zipcode: string,
        public country: string,
        public email_company: string,
        public password: string,
        public name: string,
        public lastname: string,
        public gender_contact: string,
        public email_contact: string,
        public phone_contact: string,
        public phone_contact2: string,
        public role: string,
        public terms: boolean
    ) {}
}
