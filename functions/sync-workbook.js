export async function onRequestPost(context) {
  try {
    const { url } = await context.request.json();

    if (!url) {
      return Response.json({ error: "No URL provided" }, { status: 400 });
    }

    let html = "";

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept-Language": "tl,en;q=0.9",
        },
      });

      if (response.ok) {
        html = await response.text();
      }
    } catch (error) {
      html = "";
    }

    if (!html) {
      const proxyUrl =
        "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);

      const proxyResponse = await fetch(proxyUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept-Language": "tl,en;q=0.9",
        },
      });

      if (!proxyResponse.ok) {
        throw new Error(`Unable to fetch workbook. Status: ${proxyResponse.status}`);
      }

      html = await proxyResponse.text();
    }

    const decodeHtml = (value) =>
      String(value || "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&ldquo;|&rdquo;|&#8220;|&#8221;/g, '"')
        .replace(/&lsquo;|&rsquo;|&#8216;|&#8217;/g, "'")
        .replace(/&#x2013;|&#8211;/g, "–")
        .replace(/&#x2014;|&#8212;/g, "—")
        .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
          String.fromCharCode(parseInt(hex, 16))
        )
        .replace(/&#(\d+);/g, (_, num) =>
          String.fromCharCode(parseInt(num, 10))
        );

    const cleanedHtml = decodeHtml(html)
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ");

    const text = cleanedHtml
      .replace(/<\/(p|div|li|h1|h2|h3|h4|tr|td|th)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\r/g, "\n")
      .replace(/\n{2,}/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const joined = lines.join("\n");

    const cleanLine = (line) =>
      String(line || "")
        .replace(/\s+/g, " ")
        .replace(/\s+([,.;:])/g, "$1")
        .trim();

    const getTimeNearLine = (index) => {
      for (
        let i = Math.max(0, index - 5);
        i <= Math.min(lines.length - 1, index + 2);
        i += 1
      ) {
        const match = lines[i].match(/\b([7-8]:\d{2})\b/);
        if (match) return match[1];
      }

      return "";
    };

    const getMinutes = (line) => {
      const match = line.match(/\((\d+)\s*min\.?\)/i);
      return match ? match[1] : "";
    };

    const songs = [];

    for (const match of joined.matchAll(/Awit\s+Bilang\s+(\d+)/gi)) {
      if (!songs.includes(match[1])) songs.push(match[1]);
    }

    const studentMatchers = [
      {
        type: "Pagpapasimula ng Pakikipag-usap",
        regex: /pagpapasimula\s+ng\s+pakikipag-usap/i,
      },
      {
        type: "Pakikipag-usap Muli",
        regex: /pakikipag-usap\s+muli/i,
      },
      {
        type: "Paggawa ng mga Alagad",
        regex: /paggawa\s+ng\s+mga\s+alagad/i,
      },
      {
        type: "Ipaliwanag ang Paniniwala Mo",
        regex: /ipaliwanag\s+ang\s+paniniwala/i,
      },
      {
        type: "Pahayag",
        regex: /(^|\s|\.)(pahayag)\s*(\(|$)/i,
      },
    ];

    const isStudentPart = (line) =>
      studentMatchers.some((item) => item.regex.test(line));

    const shouldSkipStudentLine = (line) => {
      const lower = line.toLowerCase();

      return (
        lower.includes("maging mahusay sa ministeryo") ||
        lower.includes("kayamanan mula") ||
        lower.includes("pamumuhay bilang") ||
        lower.includes("estudyante/assistant") ||
        lower === "estudyante" ||
        lower === "assistant"
      );
    };

    const studentParts = [];

    lines.forEach((rawLine, index) => {
      const line = cleanLine(rawLine);
      if (shouldSkipStudentLine(line)) return;

      const matched = studentMatchers.find((item) => item.regex.test(line));
      if (!matched) return;

      if (studentParts.some((part) => part.title === line)) return;

      studentParts.push({
        type: matched.type,
        title: line,
        time: getTimeNearLine(index),
        minutes: getMinutes(line),
      });
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

    lines.forEach((rawLine, index) => {
      const line = cleanLine(rawLine);
      const lower = line.toLowerCase();

      if (lower.includes("pamumuhay bilang kristiyano")) {
        inLiving = true;
        return;
      }

      if (!inLiving) return;

      // Stop collecting once CBS starts. CBS and closing comments are handled separately in the app.
      if (lower.includes("pag-aaral ng kongregasyon")) {
        inLiving = false;
        return;
      }

      if (
        lower.includes("pangwakas na komento") ||
        lower.includes("awit bilang")
      ) {
        return;
      }

      const hasMinutes = /\(\d+\s*min\.?\)/i.test(line);
      const isAlreadyStudent = isStudentPart(line);

      if (hasMinutes && !isAlreadyStudent && !lower.includes("pambungad")) {
        if (!livingParts.some((part) => part.title === line)) {
          livingParts.push({
            title: line,
            time: getTimeNearLine(index),
            minutes: getMinutes(line),
          });
        }
      }
    });

    return Response.json({
      weeks: [
        {
          bibleChapters,
          songs: songs.slice(0, 3),
          openingSong: songs[0] || "",
          middleSong: songs[1] || "",
          closingSong: songs[2] || "",
          treasuresTitle,
          studentParts: studentParts.slice(0, 8),
          livingParts: livingParts.slice(0, 6),
          debug: {
            lineCount: lines.length,
            studentPartCount: studentParts.length,
            livingPartCount: livingParts.length,
            sampleStudentParts: studentParts.slice(0, 8),
            sampleLivingParts: livingParts.slice(0, 6),
          },
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
