import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { EVENT_START, formatDateShort, formatTime } from "@/config/event";

export const alt = "SUNRISE RAVE · Jay's 30th";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const [monoton, rubik] = await Promise.all([
    readFile(join(process.cwd(), "src/app/fonts/Monoton-Regular.ttf")),
    readFile(join(process.cwd(), "src/app/fonts/Rubik-Bold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(180deg, #07040F 0%, #1a0b33 30%, #5a1257 52%, #c21f6e 66%, #ff6a3d 80%, #ffb347 100%)",
        }}
      >
        {/* sun */}
        <div
          style={{
            position: "absolute",
            bottom: -250,
            width: 560,
            height: 560,
            borderRadius: 9999,
            display: "flex",
            background: "linear-gradient(180deg, #FFE24A 0%, #FF8A2B 50%, #FF2E92 100%)",
            boxShadow: "0 0 120px #FF2E92",
          }}
        />
        {/* horizon + grid */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 140, display: "flex", background: "#07040F", borderTop: "4px solid #FF2E92" }} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: 136 - [22, 50, 82, 118][i], height: 3, background: "#FF2E92", opacity: 0.8 - i * 0.15, display: "flex" }} />
        ))}

        <div style={{ display: "flex", marginTop: 70, fontFamily: "Rubik", fontSize: 30, letterSpacing: 10, color: "#3DF2FF" }}>JAY&apos;S 30TH</div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontFamily: "Monoton",
            fontSize: 132,
            color: "#fff4f9",
            textShadow: "0 0 10px #FF2E92, 0 0 28px #FF2E92",
          }}
        >
          SUNRISE RAVE
        </div>
        <div style={{ display: "flex", marginTop: 26, fontFamily: "Rubik", fontSize: 46, color: "#FFE24A", textShadow: "0 0 18px #07040F" }}>
          {`${formatDateShort()} · ${formatTime(EVENT_START)} · Los Angeles`}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Monoton", data: monoton, style: "normal", weight: 400 },
        { name: "Rubik", data: rubik, style: "normal", weight: 700 },
      ],
    },
  );
}
