import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(LocalizedFormat);

export const getDateFormat = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dateFormat = new Date(date);
  const sethourszerodate = new Date(date);
  const hhmm = dayjs(dateFormat).format("LT");
  if (sethourszerodate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
    return "Today at " + hhmm;
  }
  if (
    sethourszerodate.setHours(0, 0, 0, 0) === yesterday.setHours(0, 0, 0, 0)
  ) {
    return "Yesterday at " + hhmm;
  }
  return `${dayjs(dateFormat).format("L")} - ${hhmm}`;
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined)
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};
