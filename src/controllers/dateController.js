export const changeMonth = (date) => {
  switch (date) {
    case "Jan":
      return "01";
      break;
    case "Feb":
      return "02";
      break;
    case "Mar":
      return "03";
      break;
    case "Apr":
      return "04";
      break;
    case "May":
      return "05";
      break;
    case "Jun":
      return "06";
      break;
    case "Jul":
      return "07";
      break;
    case "Aug":
      return "08";
      break;
    case "Sep":
      return "09";
      break;
    case "Oct":
      return "10";
      break;
    case "Nov":
      return "11";
      break;
    case "Dec":
      return "12";
      break;

    default:
      console.log("아상한 date/월 표시");
  }
};

export const changeDay = (date) => {
  switch (date) {
    case "Sun":
      return 0;
      break;
    case "Mon":
      return 1;
      break;
    case "Tue":
      return 2;
      break;
    case "Wed":
      return 3;
      break;
    case "Thu":
      return 4;
      break;
    case "Fri":
      return 5;
      break;
    case Sat:
      return 6;
      break;

    default:
      console.log("아상한 date/일 표시");
  }
};

export const possibleTimeCheck = (
  possibleStartTime,
  possibleEndTime,
  startTime,
  endTime
) => {
  let result = false;
  const pStart =
    +possibleStartTime.slice(0, 2) * 60 + +possibleStartTime.slice(3, 5);
  const start = +startTime.slice(11, 13) * 60 + +startTime.slice(14, 16);
  const pEnd = +possibleEndTime.slice(0, 2) * 60 + +possibleEndTime.slice(3, 5);
  const end = +endTime.slice(11, 13) * 60 + +endTime.slice(14, 16);

  if (pStart <= start && pStart < end && start < pEnd && end <= pEnd)
    result = true;
  return result;
};

export const gmtToUtc = (time1) =>
  new Date(
    new Date(time1).getTime() + new Date(time1).getTimezoneOffset() * 60000
  );
