import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { EVENT_CITY, EVENT_START, formatDateShort, formatTime } from "@/config/event";

export const alt = "Bani Adam · Jay's 30th";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const asset = (f: string) => readFile(join(process.cwd(), "src/assets", f));
  const [art, cormorant, pinyon, jost] = await Promise.all([
    asset("bani-adam-og.jpg"),
    asset("Cormorant-SemiBold.ttf"),
    asset("PinyonScript.ttf"),
    asset("Jost-Medium.ttf"),
  ]);
  const artSrc = `data:image/jpeg;base64,${art.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#000",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artSrc} width={630} height={630} alt="" />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: 60, flex: 1 }}>
          <div style={{ display: "flex", fontFamily: "Pinyon", fontSize: 76, color: "#FF7A59" }}>Jay turns thirty</div>
          <div style={{ display: "flex", marginTop: 18, fontFamily: "Cormorant", fontSize: 60, color: "#FFF6EC", letterSpacing: 1 }}>
            {`${formatDateShort()} · ${formatTime(EVENT_START)}`}
          </div>
          <div style={{ display: "flex", fontFamily: "Cormorant", fontSize: 44, color: "#FFC46B" }}>{EVENT_CITY}</div>
          <div style={{ display: "flex", marginTop: 30, fontFamily: "Jost", fontSize: 28, color: "#C4CFC0", lineHeight: 1.4 }}>
            A sober, all-ages sunrise dance party. Kids welcome. No gifts.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: cormorant, style: "normal", weight: 600 },
        { name: "Pinyon", data: pinyon, style: "normal", weight: 400 },
        { name: "Jost", data: jost, style: "normal", weight: 500 },
      ],
    },
  );
}
