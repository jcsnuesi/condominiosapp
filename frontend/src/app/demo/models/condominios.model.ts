export class Condominio{

    constructor(

        public alias:string,
        public typeOfProperty:string,
        public phone: string,
        public phone2: string,
        public street_1:string,
        public street_2:string,
        public sector_name:string,
        public city:string,
        public province:string,
        public zipcode:string,
        public country: string,
        public socialAreas:Array<string>,
        public units: Array<string>,
        public employees: Array<string>
    ){}


}