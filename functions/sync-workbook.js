export async function onRequestPost(context) {
  try {
    const { url } = await context.request.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "No URL provided" }), {
        status: 400,
      });
    }

    // Use proxy (important for JW.org)
    const proxy = "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);

    const response = await fetch(proxy);
    const html = await response.text();

    // REMOVE HTML TAGS → get text only
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, "\n")
      .replace(/\n+/g, "\n")
      .trim();

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

    let weekTitle = "";
    let bibleChapters = "";
    let songs = [];
    let studentParts = [];
    let livingParts = [];
    let treasuresTitle = "";

    lines.forEach(line => {
      // WEEK TITLE
      if (!weekTitle && line.match(/\b(MAYO|ABRIL|MARSO|APRIL|MAY)\b/i)) {
        weekTitle = line;
      }

      // BIBLE CHAPTERS
      if (!bibleChapters && line.match(/ISAIA[S]?\s*\d+/i)) {
        bibleChapters = line;
      }

      // SONGS
      if (line.toLowerCase().includes("awit bilang")) {
        const num = line.match(/\d+/);
        if (num) songs.push(num[0]);
      }

      // TREASURES TITLE
      if (line.match(/^1\./)) {
        treasuresTitle = line;
      }

      // STUDENT PARTS
      if (
        line.toLowerCase().includes("pagpapasimula") ||
        line.toLowerCase().includes("pakikipag") ||
        line.toLowerCase().includes("alagad") ||
        line.toLowerCase().includes("paniniwala") ||
        line.toLowerCase().includes("pahayag")
      ) {
        studentParts.push(line);
      }

      // CHRISTIAN LIVING
      if (
        line.includes("“") &&
        line.includes("”") &&
        line.match(/\d+\s*min/)
      ) {
        livingParts.push(line);
      }
    });

    return new Response(
      JSON.stringify({
        weeks: [
          {
            weekTitle,
            bibleChapters,
            songs,
            treasuresTitle,
            studentParts,
            livingParts,
          },
        ],
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}