

export class FormatFunctions {

    constructor(){}

     fullNameFormat(owner): string{
    let fullname = ''
    
        if (typeof owner.ownerName === 'string' && typeof owner.lastname === 'string') {
    
            fullname = `${owner.ownerName.toUpperCase()} ${owner.lastname.toUpperCase()}`
    
        }
    
        return fullname
    }
    
     unitFormat(unit): string{
        let unitArray = unit.ownerId.propertyDetails
        let condominioId = unit.condominiumId._id
        let ownerUnit = unit.ownerId.propertyDetails
        let units = ''
    
        unitArray.forEach(property => {
    
            if (property.addressId == condominioId) {
    
                units += property.condominium_unit
    
    
            }
    
    
    
        });
    
        return units;
    }
    
     dateFormate(date: string): string {
        let dateFormated = new Date(date)
        return dateFormated.toDateString()
    }
    
     getSeverity(invoice_status: string) {
        if (invoice_status == 'new') {
            return 'success'
        } else if (invoice_status == 'pending') {
            return 'warning'
        } else if (invoice_status == 'overdue') {
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
    
    
    
    
    

}    
