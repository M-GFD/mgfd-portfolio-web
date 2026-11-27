#!/usr/bin/env bash
# Video de fondo 1080p / 720p con grade cinematográfico horneado.
#
# Fuente: portfolio_vid_bg.mp4 (848×478, 24 fps). El .webm de 1920×1080 resultó ser un reescalado
# igual de blando, así que se reconstruye el detalle con Real-ESRGAN (realesrgan-x4plus) cuadro a cuadro.
#
# Requiere (git-ignorado, ver tools/):
#   tools/ffmpeg/ffmpeg-*-essentials_build/bin/{ffmpeg,ffprobe}.exe
#   tools/realesrgan/realesrgan-ncnn-vulkan.exe
#
# Variables: GPU (índice Vulkan para Real-ESRGAN, por defecto 1 = GPU dedicada), SKIP_UPSCALE=1 para
# rehacer solo el grade/codificación sobre los cuadros ya escalados.
set -euo pipefail
cd "$(dirname "$0")/../.."

FFBIN=$(ls -d tools/ffmpeg/ffmpeg-*-essentials_build/bin | head -1)
FF="$FFBIN/ffmpeg"
FFPROBE="$FFBIN/ffprobe"
ESR=tools/realesrgan/realesrgan-ncnn-vulkan.exe
SRC=public/images/portfolio_vid_bg.mp4
WORK=tools/video-work
OUT=public/images
GPU=${GPU:-1}

FPS=$("$FFPROBE" -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$SRC")
echo "fuente: $SRC @ $FPS fps"

# 1) Upscale ×4 con Real-ESRGAN (reanudable: solo procesa si no terminó antes).
if [ "${SKIP_UPSCALE:-0}" != "1" ] && [ ! -f "$WORK/up/.done" ]; then
  rm -rf "$WORK/frames" "$WORK/up"
  mkdir -p "$WORK/frames" "$WORK/up"
  "$FF" -v error -i "$SRC" -fps_mode passthrough "$WORK/frames/f_%05d.png"
  echo "cuadros: $(ls "$WORK/frames" | wc -l) — escalando con Real-ESRGAN (GPU $GPU)…"
  "$ESR" -i "$WORK/frames" -o "$WORK/up" -n realesrgan-x4plus -s 4 -g "$GPU" -j 2:2:2 -f png
  touch "$WORK/up/.done"
fi

# 2) Grade: negros levantados y altas suaves, saturación contenida, sombras apenas frías / altas apenas
#    cálidas y viñeta. Sin grano horneado: la página ya pone su capa de grano encima, y el ruido temporal
#    hacía incomprimible el video (116 MB a 1080p). En la página no hay filter ni blend sobre el video.
GRADE="scale=1920:1080:flags=lanczos,curves=all='0/0.035 0.25/0.24 0.5/0.51 0.85/0.85 1/0.96',eq=saturation=0.86:contrast=1.05:gamma=1.0,colorbalance=rs=-0.02:gs=0:bs=0.03:rh=0.02:gh=0:bh=-0.02,vignette=PI/5"

X264="-c:v libx264 -preset slow -tune film -profile:v high -pix_fmt yuv420p -movflags +faststart -an"

# 3) Codificación.
"$FF" -v error -y -framerate "$FPS" -i "$WORK/up/f_%05d.png" -vf "$GRADE" $X264 -crf 20 -maxrate 4.5M -bufsize 9M "$OUT/bg_1080.mp4"
"$FF" -v error -y -framerate "$FPS" -i "$WORK/up/f_%05d.png" -vf "$GRADE,scale=1280:720:flags=lanczos" $X264 -crf 22 -maxrate 2M -bufsize 4M "$OUT/bg_720.mp4"
"$FF" -v error -y -i "$OUT/bg_1080.mp4" -frames:v 1 -c:v libwebp -quality 82 "$OUT/bg_poster.webp"

ls -la "$OUT/bg_1080.mp4" "$OUT/bg_720.mp4" "$OUT/bg_poster.webp"
