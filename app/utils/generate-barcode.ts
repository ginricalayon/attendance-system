import bwipjs from "bwip-js";

export async function generateBarcodeBase64(
  studentNumber: string
): Promise<string> {
  const pngBuffer = await bwipjs.toBuffer({
    bcid: "code128",
    text: studentNumber,
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: "center",
  });
  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}
