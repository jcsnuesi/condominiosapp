

export class FormatFunctions {

    constructor(){}

     fullNameFormat(owner): string{
    let fullname = ''
    
        if (typeof owner.ownerName === 'string' && typeof owner.lastname === 'string') {
    
            fullname = `${owner.ownerName.toUpperCase()} ${owner.lastname.toUpperCase()}`
    
        }
    
        return fullname
    }

    getMonthName(month: number): string {

        if (month === null){
            return 'null'
        }

        let monthArry = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        return monthArry[month-1]

    }

    unitFormat(invoice): string {
        let unit = ''
        if (typeof invoice.unit === 'string') {
            unit = invoice.unit.toUpperCase()
        }
        return unit
    }
    

    
     dateFormate(date: string): string {
        let dateFormated = new Date(date)
        return dateFormated.toDateString()
    }
    
     getSeverity(invoice_status: string) {
        if (invoice_status == 'new' || invoice_status == 'active') {
            return 'success'
        } else if (invoice_status == 'pending') {
            return 'warning'
        } else if (invoice_status == 'overdue' || invoice_status == 'unactive') {
            return 'danger'
        } else {
            return 'info'
        }
    }
    
     transform(value: string): string {
        if (!value) return value;
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
    
     upper(string: string): string {
        return string.toUpperCase()
    }

    dateFormat2(date: string) :any{
        //2023-11-05T19:32:38.422Z
        var longDate = date.split(/[-T]/)

        var year = longDate[0]
        var month = longDate[1]
        var day = longDate[2]
        const fullDate = year + '-' + month + '-' + day
        return fullDate


    }

    
    
    
    
    

}    
