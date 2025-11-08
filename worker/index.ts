export default {
    async fetch(request) {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;

    if(path == "/api/stations/" && method == "GET") {
        const res = await fetch("https://www.ndbc.noaa.gov/data/stations/station_table.txt")
        const text = await res.text();
        return new Response(text, {
            status: 200,
            headers: {"Context-Type": "text/plain"}
        });
    }
    return new Response(null, { status: 404 });
  }
} satisfies ExportedHandler<Env>;
