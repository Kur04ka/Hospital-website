/**
 * Formats the given ISO string date into a formatted date string in the format "DD.MM.YYYY".
 *
 * @param {string} isoString - The input ISO string date to be formatted.
 * @return {string} The formatted date string.
 */
export const formatDate = (isoString: string) => {
	const date = new Date(isoString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
	const day = String(date.getDate()).padStart(2, "0");

	return `${day}.${month}.${year}`;
};

/**
 * Formats the given dateTimeString into hours and minutes.
 *
 * @param {string} dateTimeString - The input date and time string to be formatted.
 * @return {string} The formatted time in the format "HH:mm".
 */
export const formatTime = (dateTimeString: string) => {
	const date = new Date(dateTimeString);
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${hours}:${minutes}`;
};
