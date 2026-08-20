export const formatDuration = (minutes: number) =>
  minutes >= 60
    ? `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ""}`
    : `${minutes} minutes`;

export const formatStatus = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);
