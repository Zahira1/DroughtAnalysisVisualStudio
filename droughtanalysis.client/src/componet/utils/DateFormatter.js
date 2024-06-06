export function QueryDate(date) {
    //const formatDate = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayLocalDate = yesterday.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const friday = new Date(date);
    friday.setDate(friday.getDate() + 4);
    const fridayLocalDate =friday.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const queryDrought =`date > date '${yesterdayLocalDate}' AND date < date '${fridayLocalDate}'`
    return queryDrought;
 }

 export function QueryDateandCounty(date, county) {
     let loc;
   // console.log(county)
    if (county === null) {
         loc = "Texas"
    }else{
         loc = county
     }
     const formattedLoc = loc.map(item => `'${item}'`).join(', ');
   //  console.log("query",loc)
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayLocalDate = yesterday.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const friday = new Date(date);
    friday.setDate(friday.getDate() + 4);
    const fridayLocalDate =friday.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
     const queryDrought = `location in (${formattedLoc}) AND date > date '${yesterdayLocalDate}' AND date < date '${fridayLocalDate}'`
    return queryDrought;

 }