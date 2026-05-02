export async function onRequestPost(context) {
  try {
    const { url } = await context.request.json();

    if (!url) {
      return Response.json({ error: "No URL provided" }, { status: 400 });
    }

    const proxyUrl =
      "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);

    const response = await fetch(proxyUrl);
    const html = await response.text();

    const text = html
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, "\n")
      .replace(/\n+/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();

    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const joined = lines.join("\n");

    const songs = [...joined.matchAll(/Awit\s+Bilang\s+(\d+)/gi)]
      .map((m) => m[1])
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .slice(0, 3);

    const studentParts = [];

    lines.forEach((line, index) => {
      const lower = line.toLowerCase();

      const isStudent =
        lower.includes("pagpapasimula ng pakikipag-usap") ||
        lower.includes("pakikipag-usap muli") ||
        lower.includes("paggawa ng mga alagad") ||
        lower.includes("ipaliwanag ang paniniwala") ||
        lower.startsWith("pahayag") ||
        lower.includes(" pahayag ");

      if (!isStudent) return;

      const type = lower.includes("pagpapasimula")
        ? "Pagpapasimula ng Pakikipag-usap"
        : lower.includes("pakikipag-usap muli")
        ? "Pakikipag-usap Muli"
        : lower.includes("paggawa ng mga alagad")
        ? "Paggawa ng mga Alagad"
        : lower.includes("ipaliwanag")
        ? "Ipaliwanag ang Paniniwala Mo"
        : "Pahayag";

      let time = "";
      for (let i = Math.max(0, index - 3); i <= index + 1; i++) {
        const match = lines[i]?.match(/\b([7-8]:\d{2})\b/);
        if (match) time = match[1];
      }

      if (!studentParts.some((p) => p.title === line)) {
        studentParts.push({
          type,
          title: line,
          time,
          minutes: line.match(/\((\d+)\s*min/i)?.[1] || "",
        });
      }
    });

    const treasuresTitle =
      lines.find((line) => /^1\.\s*/.test(line) && /\(\d+\s*min/i.test(line)) ||
      "";

    const bibleChapters =
      joined.match(/\b(ISAIAS\s+\d+\s*[–-]\s*\d+)/i)?.[1] ||
      joined.match(/\b(ISAIAS\s+\d+)/i)?.[1] ||
      "";

    const livingParts = [];
    let inLiving = false;

    lines.forEach((line, index) => {
      const lower = line.toLowerCase();

      if (lower.includes("pamumuhay bilang kristiyano")) {
        inLiving = true;
        return;
      }

      if (!inLiving) return;

      if (
        lower.includes("pag-aaral ng kongregasyon") ||
        lower.includes("pangwakas na komento") ||
        lower.includes("awit bilang")
      ) {
        return;
      }

      const hasMinutes = /\(\d+\s*min/i.test(line);
      const isStudent = studentParts.some((p) => p.title === line);

      if (hasMinutes && !isStudent && !lower.includes("pambungad")) {
        let time = "";
        for (let i = Math.max(0, index - 3); i <= index + 1; i++) {
          const match = lines[i]?.match(/\b([7-8]:\d{2})\b/);
          if (match) time = match[1];
        }

        if (!livingParts.some((p) => p.title === line)) {
          livingParts.push({
            title: line,
            time,
            minutes: line.match(/\((\d+)\s*min/i)?.[1] || "",
          });
        }
      }
    });

    return Response.json({
      weeks: [
        {
          bibleChapters,
          songs,
          openingSong: songs[0] || "",
          middleSong: songs[1] || "",
          closingSong: songs[2] || "",
          treasuresTitle,
          studentParts: studentParts.slice(0, 8),
          livingParts: livingParts.slice(0, 5),
        },
      ],
    });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to sync workbook",
        details: String(error),
      },
      { status: 500 }
    );
  }
}