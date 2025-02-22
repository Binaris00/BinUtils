


export function convertToCallouts(paragraphsWithTime: { paragraph: string; time: string }[]): string {
    let result = "";
    let currentGroup: string[] = [];
    const groupSize = 3;
  
    paragraphsWithTime.forEach(({ paragraph, time }, index) => {
      currentGroup.push(`>> [!journal_daily_2] ${time}\n>> ${paragraph}`);
      if (currentGroup.length === groupSize || index === paragraphsWithTime.length - 1) {
        result += `> [!multi-column]\n${currentGroup.join("\n>\n")}\n\n`;
        currentGroup = [];
      }
    });
  
    return result.trim();
}

export function processTime(content: string): { paragraph: string; time: string }[] {
  const paragraphs = content.split(/\n\s*\n/);
  const timeRegex = /-?\s*(\d{1,2}:\d{2}\s*(AM|PM))$/i;
  
  return paragraphs.map((paragraph) => {
    const trimmedParagraph = paragraph.trim();
    const match = trimmedParagraph.match(timeRegex);
    const time = match ? match[1] : "0:00 AM-PM";
    const cleanParagraph = match ? trimmedParagraph.replace(timeRegex, "").trim() : trimmedParagraph;
    return { paragraph: cleanParagraph, time }; 
  });
}