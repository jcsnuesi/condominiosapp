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
    getSeverity(_status: string) {
        if (_status == 'new' || _status == 'active') {
            return 'success';
        } else if (_status == 'pending') {
            return 'warning';
        } else if (_status == 'overdue' || _status == 'unactive') {
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
    titleCase(text: string): string {
        if (!text) return text;

        return text
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
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

    dateTimeFormat(date: Date): string {
        if (date === null || date === undefined) {
            return null;
        }

        const dateObj = new Date(date);

        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();

        let hours = dateObj.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Convierte 0 a 12
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');

        return `${month}-${day}-${year} ${hours}:${minutes} ${ampm}`;
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
