import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode } from "lucide-react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { RecyclingBin } from "@/models/RecyclingBin";

interface RecyclingBinQRModalProps {
  bin: RecyclingBin;
}

export function RecyclingBinQRModal({ bin }: RecyclingBinQRModalProps) {
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [size, setSize] = useState(240);
  const [marginSize, setMarginSize] = useState(1);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <QrCode className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col items-center">
        <DialogHeader>
          <DialogTitle>QR Code for {bin.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="svg" className="w-full flex flex-col items-center">
          <TabsList className="mb-4">
            <TabsTrigger value="png">PNG</TabsTrigger>
            <TabsTrigger value="svg">SVG</TabsTrigger>
          </TabsList>

          <TabsContent
            value="svg"
            className="mt-0 flex flex-col items-center gap-4"
          >
            <QRCodeSVG
              id="qr-svg"
              value={bin.qr_key}
              size={size}
              fgColor={fgColor}
              bgColor={bgColor}
              level="H"
              marginSize={marginSize}
            />
          </TabsContent>
          <TabsContent
            value="png"
            className="mt-0 flex flex-col items-center gap-4"
          >
            <QRCodeCanvas
              id="qr-canvas"
              value={bin.qr_key}
              size={size}
              fgColor={fgColor}
              bgColor={bgColor}
              level="H"
              marginSize={marginSize}
            />
          </TabsContent>

          {/* Controls */}

          <div className="grid gap-4 w-full">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="size">Size (px)</Label>
                <Input
                  id="size"
                  type="number"
                  value={size}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0) setSize(val);
                  }}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="marginSize">Margin Size</Label>
                <Input
                  id="marginSize"
                  type="number"
                  value={marginSize}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0) setMarginSize(val);
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="fgColor">Foreground</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="fgColor"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <span className="text-sm font-mono">{fgColor}</span>
                </div>
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="bgColor">Background</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <span className="text-sm font-mono">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Download */}

          <TabsContent
            value="svg"
            className="mt-0 flex flex-col items-center gap-4"
          >
            <Button
              onClick={() => {
                const svg = document.getElementById("qr-svg");
                if (svg) {
                  const svgData = new XMLSerializer().serializeToString(svg);
                  const blob = new Blob([svgData], {
                    type: "image/svg+xml;charset=utf-8",
                  });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `qr-${bin.name}.svg`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
            >
              Download SVG
            </Button>
          </TabsContent>

          <TabsContent
            value="png"
            className="mt-0 flex flex-col items-center gap-4"
          >
            <Button
              onClick={() => {
                const canvas = document.getElementById(
                  "qr-canvas"
                ) as HTMLCanvasElement;
                if (canvas) {
                  const url = canvas.toDataURL("image/png");
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `qr-${bin.name}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
            >
              Download PNG
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
