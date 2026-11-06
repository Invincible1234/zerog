import { tablePage } from "@/lib/tables";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ osd: string }> },
) {
  const { osd } = await params;
  const search = new URL(request.url).searchParams;
  try {
    const result = tablePage(osd, {
      query: (search.get("q") || "").slice(0, 200),
      contrast: search.get("contrast") || undefined,
      significant: search.get("significant") === "true",
      sort: search.get("sort") || "adjustedP",
      page: search.get("page") || "1",
    });
    if (!result)
      return Response.json(
        {
          error:
            "This study has no bundled expression table. Inspiration4 entries are listed only.",
        },
        { status: 404 },
      );
    return Response.json(result, {
      headers: {
        "Cache-Control": "private, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    if (error instanceof RangeError)
      return Response.json({ error: error.message }, { status: 400 });
    console.error("Bundled table could not be read", error);
    return Response.json(
      { error: "The bundled table could not be read. Please try again." },
      { status: 500 },
    );
  }
}
