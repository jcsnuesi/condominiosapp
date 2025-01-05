export class FormatFunctions {
    constructor() {}

    fullNameFormat(owner): string {
        let fullname = '';

        if (
            Boolean(owner.name != undefined) &&
            Boolean(owner.lastname != undefined)
        ) {
            fullname = `${owner.name.toUpperCase()} ${owner.lastname.toUpperCase()}`;
        } else {
            fullname = `${owner.company.toUpperCase()}`;
        }

        return fullname;
    }

    getMonthName(month: number): string {
        if (month === null) {
            return 'null';
        }

        let monthArry = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        return monthArry[month - 1];
    }

    unitFormat(invoice): string {
        let unit = '';
        if (typeof invoice.unit === 'string') {
            unit = invoice.unit.toUpperCase();
        }
        return unit;
    }

    dateFormat(date: string): string {
        let dateFormated = new Date(date);
        return dateFormated.toDateString();
    }

    getSeverityUser(user_status: string) {
        if (user_status == 'active') {
            return 'success';
        } else {
            return 'danger';
        }
    }
    getSeverity(invoice_status: string) {
        if (invoice_status == 'new' || invoice_status == 'active') {
            return 'success';
        } else if (invoice_status == 'pending') {
            return 'warning';
        } else if (
            invoice_status == 'overdue' ||
            invoice_status == 'unactive'
        ) {
            return 'danger';
        } else {
            return 'info';
        }
    }

    transform(value: string): string {
        if (!value) return value;
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }

    upper(string: string): string {
        return string.toUpperCase();
    }

    dateFormat2(date: string): any {
        //2023-11-05T19:32:38.422Z
        var longDate = date.split(/[-T]/);

        var year = longDate[0];
        var month = longDate[1];
        var day = longDate[2];
        const fullDate = day + '-' + month + '-' + year;
        return fullDate;
    }

    dateTimeFormat(date: string): any {
        if (date === null || date === undefined) {
            return null;
        }
        //2023-11-05T19:32:38.422Z
        var longDate = date.split(/[-T:.]/);

        var year = longDate[0];
        var month = longDate[1];
        var day = longDate[2];
        var hour = longDate[3];
        var minute = longDate[4];

        const fullDate =
            day + '-' + month + '-' + year + ' ' + hour + ':' + minute;
        return fullDate;
    }

    genderPipe(gender: string): string {
        let genders = ['m', 'male'];

        if (genders.find((g) => g === gender)) {
            return 'Male';
        } else {
            return 'Female';
        }
    }
}
