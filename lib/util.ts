import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// UTC -> "2022_04" のフォーマットに変換
export const formatDate = (date: any) => {
    const formattedDate = dayjs.utc(date).tz("Asia/Tokyo").format("YYYY-MM");
    return formattedDate;
}
export const groupBy = function (contents: number[]) {
    return contents.reduce(function (group: any, x: any) {
        const yearMonthString = formatDate(new Date(x["date"]));
        (group[yearMonthString] = group[yearMonthString] || []).push(x);
        return group;
    }, {});
}