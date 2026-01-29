/**
 * Formats an ISO date string into a readable format: "Month Day, Year, Hour:Minute AM/PM"
 * Example: "Jan 29, 2026, 09:24 AM"
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        // Check if date is valid
        if (isNaN(date.getTime())) return dateString;

        return new Intl.DateTimeFormat('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    } catch (e) {
        return dateString;
    }
};
