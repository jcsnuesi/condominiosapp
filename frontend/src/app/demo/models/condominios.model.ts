import { AnyObject } from 'chart.js/types/basic';

export class Condominio {
    constructor(
        public avatar: string,
        public alias: string,
        public typeOfProperty: any,
        public phone: string,
        public phone2: string,
        public street_1: string,
        public street_2: string,
        public sector_name: string,
        public city: string,
        public province: string,
        public zipcode: string,
        public country: any,
        public socialAreas: any,
        public units: Array<string>,
        public employees: Array<string>,
        public mPayment: null,
        public paymentDate: Date,
        public unitFormat: string[],
        public user_id: string
    ) {}
}
