export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  console.log(date, now);
  
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
console.log(diffInSeconds);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}


export function generateProjectCode(name: string): string {
  return name.substring(0, 3).toUpperCase();
}

export function generateFlagCode(projectCode: string, flagCount: number): string {
  // must return like PRJ0001, PRJ0002, etc.
  return `${projectCode}${String(flagCount + 1).padStart(4, "0")}`;
}
