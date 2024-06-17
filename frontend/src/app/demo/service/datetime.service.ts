export function dateTimeFormatter(dates):string{

    
    let dateFormatted = new Date(dates)
    let year = dateFormatted.getFullYear(); 
    let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let month = dateFormatted.getMonth() + 1; 
    let day = dateFormatted.getDate(); 
    return `${day}-${monthNames[month]}-${year}`
}