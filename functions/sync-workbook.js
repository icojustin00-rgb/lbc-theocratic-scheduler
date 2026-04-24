export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { url } = body;

    if (!url) {
      return new Response(JSON.stringify({ error: "No URL provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch(url);
    const html = await response.text();

    const text = html.replace(/<[^>]*>/g, "\n");

    const lines = text
      .split(/\n|\r/)
      .map((line) => line.trim())
      .filter(Boolean);

    const detect = (line) => {
      const t = line.toLowerCase();

      if (t.includes("starting") || t.includes("pagpapasimula")) return "Starting a Conversation";
      if (t.includes("following") || t.includes("muli")) return "Following Up";
      if (t.includes("making disciples") || t.includes("alagad")) return "Making Disciples";
      if (t.includes("explain") || t.includes("belief") || t.includes("paniniwala")) return "Explain Your Belief";
      if (t.includes("talk") || t.includes("pahayag")) return "Talk";

      return null;
    };

    const detectedParts = lines.map(detect).filter(Boolean);

    return new Response(
      JSON.stringify({
        weeks: [
          {
            studentParts: detectedParts.slice(0, 5),
          },
        ],
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to sync workbook" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}