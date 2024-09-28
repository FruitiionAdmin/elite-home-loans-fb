export default function getCurrentDateString(timestamp) {
    // const currentDate = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

    // const [month, day, year] = currentDate.split("/");

    // const formattedDate = `${month}/${day}/${year}`;
    // return formattedDate;
    const tz = Intl.DateTimeFormat().resolvedOptions()
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: tz.timeZone
      });
      return formattedTime;
}