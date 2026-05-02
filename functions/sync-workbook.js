export async function onRequestPost(context) {
  try {
    const { url } = await context.request.json();

    if (!url) {
      return Response.json({ error: "No URL provided" }, { status: 400 });
    }

    // ===============================
    // FETCH WORKBOOK (WITH FALLBACK)
    // ===============================
    let html = "";

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept-Language": "tl,en;q=0.9",
        },
      });

      html = await res.text();
    } catch {
      const proxyUrl =
        "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);

      const proxy = await fetch(proxyUrl);
      html = await proxy.text();
    }

    // ===============================
    // CLEAN HTML → TEXT
    // ===============================
    const text = html
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&ldquo;|&rdquo;/g, '"')
      .replace(/&lsquo;|&rsquo;/g, "'")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, "\n")
      .replace(/\n+/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();

    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const joined = lines.join("\n");

    // ===============================
    // SONGS
    // ===============================
    const songs = [...joined.matchAll(/Awit\s+Bilang\s+(\d+)/gi)]
      .map((m) => m[1])
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .slice(0, 3);

    // ===============================
    // TIME HELPER
    // ===============================
    const getTime = (index) => {
      for (let i = Math.max(0, index - 4); i <= index + 2; i++) {
        const match = lines[i]?.match(/\b([7-8]:\d{2})\b/);
        if (match) return match[1];
      }
      return "";
    };

    // ===============================
    // STUDENT PARTS (SMART DETECT)
    // ===============================
    const studentParts = [];

    const isStudent = (line) => {
      const l = line.toLowerCase();

      return (
        l.includes("pagpapasimula ng pakikipag-usap") ||
        l.includes("pakikipag-usap muli") ||
        l.includes("paggawa ng mga alagad") ||
        l.includes("ipaliwanag ang paniniwala") ||
        l.startsWith("pahayag") ||
        l.includes(" pahayag ")
      );
    };

    const getType = (line) => {
      const l = line.toLowerCase();

      if (l.includes("pagpapasimula")) return "Pagpapasimula ng Pakikipag-usap";
      if (l.includes("pakikipag-usap muli")) return "Pakikipag-usap Muli";
      if (l.includes("paggawa ng mga alagad")) return "Paggawa ng mga Alagad";
      if (l.includes("ipaliwanag")) return "Ipaliwanag ang Paniniwala Mo";
      return "Pahayag";
    };

    lines.forEach((line, i) => {
      if (!isStudent(line)) return;

      if (studentParts.some((p) => p.title === line)) return;

      studentParts.push({
        type: getType(line),
        title: line,
        time: getTime(i),
        minutes: line.match(/\((\d+)\s*min/i)?.[1] || "",
      });
    });

    // ===============================
    // TREASURES TITLE
    // ===============================
    const treasuresTitle =
      lines.find((l) => /^1\.\s*/.test(l) && /\(\d+\s*min/i.test(l)) || "";

    // ===============================
    // BIBLE CHAPTERS
    // ===============================
    const bibleChapters =
      joined.match(/\b(ISAIAS\s+\d+\s*[–-]\s*\d+)/i)?.[1] ||
      joined.match(/\b(ISAIAS\s+\d+)/i)?.[1] ||
      "";

    // ===============================
    // LIVING PARTS (DYNAMIC)
    // ===============================
    const livingParts = [];
    let inLiving = false;

    lines.forEach((line, i) => {
      const l = line.toLowerCase();

      if (l.includes("pamumuhay bilang kristiyano")) {
        inLiving = true;
        return;
      }

      if (!inLiving) return;

      // STOP collecting once CBS is reached
if (lower.includes("pag-aaral ng kongregasyon")) {
  inLiving = false;
  return;
}

// SKIP unwanted parts
if (
  lower.includes("pangwakas na komento") ||
  lower.includes("awit bilang")
) {
  return;
}

      const hasMinutes = /\(\d+\s*min/i.test(line);
      const isAlreadyStudent = studentParts.some((p) => p.title === line);

      if (hasMinutes && !isAlreadyStudent && !l.includes("pambungad")) {
        if (!livingParts.some((p) => p.title === line)) {
          livingParts.push({
            title: line,
            time: getTime(i),
            minutes: line.match(/\((\d+)\s*min/i)?.[1] || "",
          });
        }
      }
    });

    // ===============================
    // RESPONSE
    // ===============================
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
          livingParts: livingParts.slice(0, 6),
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