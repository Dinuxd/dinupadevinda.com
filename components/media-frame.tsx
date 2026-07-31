import Image from "next/image";
import type { ProjectMedia } from "@/content/projects";

type MediaFrameProps = {
  media?: ProjectMedia;
  priority?: boolean;
  className?: string;
};

export function MediaFrame({ media, priority, className = "" }: MediaFrameProps) {
  if (!media) {
    return (
      <div
        className={`soft-panel flex aspect-[16/10] items-center justify-center rounded-xl border-dashed text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 ${className}`}
      >
        Evidence pending
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <div className={`media-depth overflow-hidden rounded-xl border border-cyan-300/12 bg-black ${className}`}>
        <video
          className="aspect-video w-full object-cover"
          src={media.src}
          controls
          playsInline
          preload="none"
          poster={media.poster}
          aria-label={media.alt}
        />
      </div>
    );
  }

  const imageFit = media.fit === "contain" ? "object-contain p-2" : "object-cover";

  return (
    <div className={`media-depth overflow-hidden rounded-xl border border-cyan-300/12 bg-graphite-900/60 ${className}`}>
      <Image
        src={media.src}
        alt={media.alt}
        width={1200}
        height={760}
        priority={priority}
        className={`aspect-[16/10] w-full ${imageFit}`}
      />
    </div>
  );
}
