export class Staff {
    constructor(
        public name: string,
        public lastname: string,
        public gender: { label: string; code: string },
        public government_id: string,
        public phone: string,
        public position: { label: string; code: string },
        public email: string,
        public permissions: Array<{ label: string; code: string }>,
        public password?: string
    ) {}
}
