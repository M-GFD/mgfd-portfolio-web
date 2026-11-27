import { screensFor } from '@/data/mockup-screens';
import { cn } from '@/lib/utils';

/**
 * Composición sin WebGL (reduced-motion, sin soporte o contexto perdido):
 * las mismas capturas en marcos CSS con sombras de superficie.
 */
export default function StaticComposition({ projectId, className }: { projectId: number; className?: string }) {
  const { devices } = screensFor(projectId);
  const laptop = devices.laptop?.[0];
  const tablet = devices.tablet?.[0];
  const phone = devices.phone?.[0];
  return (
    <div className={cn('relative flex h-full w-full items-center justify-center', className)}>
      {laptop ? (
        <div className="surface-2 relative w-[80%] rounded-[18px] p-[1.4%] shadow-[0_40px_90px_-30px_rgb(0_0_0/0.85),0_2px_6px_rgb(0_0_0/0.45)]">
          <img src={laptop} alt="" loading="lazy" decoding="async" className="aspect-[16/10] w-full rounded-[10px] object-cover object-top" />
        </div>
      ) : null}
      {tablet ? (
        <div className="absolute right-[3%] bottom-[4%] w-[22%] rounded-[16px] bg-black p-[0.9%] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] ring-1 ring-white/10">
          <img src={tablet} alt="" loading="lazy" decoding="async" className="aspect-[1668/2388] w-full rounded-[11px] object-cover object-top" />
        </div>
      ) : null}
      {phone ? (
        <div className="absolute bottom-[2%] left-[4%] w-[13%] rounded-[18px] bg-black p-[0.7%] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] ring-1 ring-white/10">
          <img src={phone} alt="" loading="lazy" decoding="async" className="aspect-[780/1688] w-full rounded-[14px] object-cover object-top" />
        </div>
      ) : null}
    </div>
  );
}
