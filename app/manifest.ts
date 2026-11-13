import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "OBAFEMIX", short_name: "OBAFEMIX", description: "I build solutions for a better tomorrow.", start_url: "/", display: "standalone", background_color: "#05010f", theme_color: "#05010f", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] };
}
