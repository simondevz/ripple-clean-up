export const convertToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const ShorthenedAddress = ({ address, className }) => {
  return (
    <span className={className}>
      {address.slice(0, 6)}...
      {address.slice(address.length - 6, address.length)}
    </span>
  );
};

// export const GetTimeAgo = ({ time }) => {
//   const utcDate = new Date((Number(time) + 946684800) * 1000);
//   const currentDate = new Date();

//   // Calculate the time difference in milliseconds
//   const timeDifference = currentDate - utcDate;

//   // Calculate time units (days, hours, minutes, seconds) from the time difference
//   const millisecondsPerSecond = 1000;
//   const millisecondsPerMinute = 60 * millisecondsPerSecond;
//   const millisecondsPerHour = 60 * millisecondsPerMinute;
//   const millisecondsPerDay = 24 * millisecondsPerHour;

//   const days = Math.floor(timeDifference / millisecondsPerDay);
//   const hours = Math.floor(
//     (timeDifference % millisecondsPerDay) / millisecondsPerHour
//   );
//   const minutes = Math.floor(
//     (timeDifference % millisecondsPerHour) / millisecondsPerMinute
//   );
//   const seconds = Math.floor(
//     (timeDifference % millisecondsPerMinute) / millisecondsPerSecond
//   );

//   // Display the time difference
//   console.log(
//     `Time elapsed: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
//   );
//   let timeAgo;
//   if (!minutes) {
//     timeAgo = seconds + "s";
//   } else if (!hours) {
//     timeAgo = minutes + "m";
//   } else if (!days) {
//     timeAgo = hours + "h";
//   } else if (days < 7) {
//     timeAgo = days + "d";
//   } else {
//     timeAgo = `${utcDate.getDay} ${utcDate.getMonth}`;
//   }

//   return <>{timeAgo}</>;
// };
