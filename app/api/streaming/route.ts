import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get("title");
  const tmdbId = searchParams.get("tmdbId");

  if (!title) {
    return NextResponse.json(
      { error: "Title parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Intentar Phim API primero si tenemos TMDB ID
    if (tmdbId) {
      try {
        const controller1 = new AbortController();
        const timeout1 = setTimeout(() => controller1.abort(), 5000);

        const phimResponse = await fetch(
          `https://phimapi.com/tmdb/movie/${tmdbId}`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0",
            },
            next: { revalidate: 3600 },
            signal: controller1.signal,
          }
        );

        clearTimeout(timeout1);

        if (phimResponse.ok) {
          const phimData = await phimResponse.json();
          
          // Phim API puede tener información de episodios/servidores
          if (phimData.movie && phimData.movie.slug) {
            const controller2 = new AbortController();
            const timeout2 = setTimeout(() => controller2.abort(), 5000);

            const detailResponse = await fetch(
              `https://phimapi.com/phim/${phimData.movie.slug}`,
              {
                headers: {
                  "User-Agent": "Mozilla/5.0",
                },
                next: { revalidate: 3600 },
                signal: controller2.signal,
              }
            );

            clearTimeout(timeout2);

            if (detailResponse.ok) {
              const detailData = await detailResponse.json();
              
              // Buscar servidores de streaming en los episodios
              if (detailData.movie && detailData.movie.episodes && detailData.movie.episodes.length > 0) {
                const episode = detailData.movie.episodes[0];
                if (episode.server_data && episode.server_data.length > 0) {
                  const servers = episode.server_data;
                  const streamingLinks = servers
                    .slice(0, 5)
                    .map((server: any, index: number) => ({
                      name: server.name || `Servidor ${index + 1}`,
                      url: server.link_embed || server.link_m3u8 || `https://phimapi.com/phim/${phimData.movie.slug}`,
                      icon: "pelisplus",
                    }));

                  if (streamingLinks.length > 0) {
                    return NextResponse.json({
                      success: true,
                      links: streamingLinks,
                    });
                  }
                }
              }
            }
          }
        }
      } catch (phimError) {
        console.log("Phim API no disponible");
      }
    }

    // Intentar Consumet API como alternativa
    try {
      const controller1 = new AbortController();
      const timeout1 = setTimeout(() => controller1.abort(), 5000);

      const consumetResponse = await fetch(
        `https://api.consumet.org/movies/flixhq/${encodeURIComponent(title)}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
          },
          next: { revalidate: 3600 },
          signal: controller1.signal,
        }
      );

      clearTimeout(timeout1);

      if (consumetResponse.ok) {
        const data = await consumetResponse.json();
        if (data.results && data.results.length > 0) {
          const bestMatch = data.results[0];
          
          const controller2 = new AbortController();
          const timeout2 = setTimeout(() => controller2.abort(), 5000);
          
          const streamResponse = await fetch(
            `https://api.consumet.org/movies/flixhq/info?id=${bestMatch.id}`,
            {
              headers: {
                "User-Agent": "Mozilla/5.0",
              },
              next: { revalidate: 3600 },
              signal: controller2.signal,
            }
          );

          clearTimeout(timeout2);

          if (streamResponse.ok) {
            const streamData = await streamResponse.json();
            if (streamData.sources && streamData.sources.length > 0) {
              return NextResponse.json({
                success: true,
                links: streamData.sources.slice(0, 5).map((source: any, index: number) => ({
                  name: source.quality || `Opción ${index + 1}`,
                  url: source.url,
                  icon: "pelisplus",
                })),
              });
            }
          }
        }
      }
    } catch (consumetError) {
      console.log("Consumet API no disponible");
    }

    // Si no hay resultados, retornar null para usar fallback
    return NextResponse.json({
      success: false,
      links: null,
    });
  } catch (error) {
    console.error("Error fetching streaming links:", error);
    return NextResponse.json({
      success: false,
      links: null,
    });
  }
}

