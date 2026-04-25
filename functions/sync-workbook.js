export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { url } = body;

    if (!url) {
      return Response.json({ error: "No URL provided" }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "tl,en;q=0.9",
      },
    });

    if (!response.ok) {
      return Response.json(
        { error: `Failed to fetch workbook: ${response.status}` },
        { status: 500 }
      );
    }

    const html = await response.text();

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, "\n")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();

    const detected = [];

    const add = (part) => {
      if (detected.length < 5) detected.push(part);
    };

    const countMatches = (regex) => {
      const matches = text.match(regex);
      return matches ? matches.length : 0;
    };

    const startingCount = countMatches(/pagpapasimula ng pakikipag-usap|starting a conversation/gi);
    const followingCount = countMatches(/pakikipag-usap muli|following up|pagdalaw-muli/gi);
    const makingCount = countMatches(/paggawa ng alagad|making disciples/gi);
    const beliefCount = countMatches(/ipaliwanag.*paniniwala|explain.*belief/gi);
    const talkCount = countMatches(/(?:^|\s)pahayag(?:\s|:)|talk/gi);

    for (let i = 0; i < startingCount; i++) add("Starting a Conversation");
    for (let i = 0; i < followingCount; i++) add("Following Up");
    for (let i = 0; i < makingCount; i++) add("Making Disciples");
    for (let i = 0; i < beliefCount; i++) add("Explain Your Belief");
    for (let i = 0; i < talkCount; i++) add("Talk");

    return Response.json({
      weeks: [
        {
          studentParts: detected.slice(0, 5),
          debug: {
            startingCount,
            followingCount,
            makingCount,
            beliefCount,
            talkCount,
          },
        },
      ],
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to sync workbook", details: String(error) },
      { status: 500 }
    );
  }
}