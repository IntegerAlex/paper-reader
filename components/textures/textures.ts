import { type TextureId } from "@/store/reader-store";

interface TextureDef {
  id: TextureId;
  name: string;
  description: string;
  status: "available" | "new" | "coming";
  preview: string;
}

export const textures: TextureDef[] = [
  {
    id: "classic-matte",
    name: "Classic Matte",
    description:
      "A smooth, diffused finish that gently softens harsh pixels and contrast, giving your screen the clean, restful feel of premium matte paper.",
    status: "available",
    preview: "Smooth · Diffused · Restful",
  },
  {
    id: "whisper-weave",
    name: "Whisper Weave",
    description:
      "A delicate, tactile fabric texture that cuts through screen glare, bringing a soft, organic warmth to your daily reading and writing.",
    status: "available",
    preview: "Fabric · Tactile · Warm",
  },
  {
    id: "sunbaked-parchment",
    name: "Sunbaked Parchment",
    description:
      "A rich, heavy grain bathed in a comforting amber glow, perfect for late-night sessions or when you want the cozy familiarity of an aged manuscript.",
    status: "available",
    preview: "Rich · Amber · Aged",
  },
  {
    id: "saddle-linen",
    name: "Saddle Linen",
    description:
      "A coarse, natural linen weave with warm earthy tones. Rugged and grounding, like working on a well-worn wooden desk.",
    status: "available",
    preview: "Coarse · Earthy · Rugged",
  },
  {
    id: "painters-press",
    name: "Painter's Press",
    description:
      "A textured cold-press surface with subtle tooth and depth, inspired by the slightly rough grain of watercolor paper fresh off the press.",
    status: "available",
    preview: "Cold-press · Tooth · Depth",
  },
  {
    id: "mulberry-veil",
    name: "Mulberry Veil",
    description:
      "A sheer, delicate surface with a deep plum undertone. Soft and atmospheric, like reading by dim lamplight through translucent paper.",
    status: "available",
    preview: "Sheer · Plum · Atmospheric",
  },
  {
    id: "vellum-mist",
    name: "Vellum Mist",
    description:
      "A soft, semi-translucent haze that diffuses light like frosted vellum. Calm and minimal, perfect for long reading sessions.",
    status: "new",
    preview: "Haze · Calm · Minimal",
  },
  {
    id: "monastic-felt",
    name: "Monastic Felt",
    description:
      "A dense, close-cropped fiber surface with a muted warmth. Quiet and meditative, like writing on the cover of a worn leather journal.",
    status: "coming",
    preview: "Dense · Muted · Meditative",
  },
  {
    id: "carbon-ledger",
    name: "Carbon Ledger",
    description:
      "A precise, fine-ruled surface with a cool graphite tone. Sharp and structured, built for spreadsheets, code, and focused analytical work.",
    status: "coming",
    preview: "Precise · Graphite · Sharp",
  },
];
