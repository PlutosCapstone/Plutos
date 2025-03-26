export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + 1));
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const wrapText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    const index = text.lastIndexOf(" ", maxLength);
    return text.substring(0, index) + "\n" + text.substring(index + 1);
  }
  return text;
};

export const nameCase = (name: string) => {
  return name
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(" ");
};

export const isWithinTimeRange = (dateString: string, range: string) => {
  const givenDate = new Date(dateString);
  const today = new Date();

  let rangeStart = new Date();

  switch (range) {
    case "last_week":
      rangeStart.setDate(today.getDate() - 7);
      break;
    case "last_month":
      rangeStart.setMonth(today.getMonth() - 1);
      break;
    case "last_3_months":
      rangeStart.setMonth(today.getMonth() - 3);
      break;
    default:
      return false;
  }

  return (
    givenDate.getTime() >= rangeStart.getTime() &&
    givenDate.getTime() <= today.getTime()
  );
};

export const truncateString = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};
