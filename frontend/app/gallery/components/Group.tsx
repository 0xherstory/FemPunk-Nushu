import Image from "next/image";

const imgImg6407 = "/gallery/imgImg6407.png";
const img1 = "/gallery/img1.png";
const imgGroup89 = "/gallery/imgGroup89.png";

function Group({ className }: { className?: string }) {
  return (
    <div className={className} data-node-id="101:2539">
      <div className="absolute bg-[#2c2c2c] border border-[rgba(255,255,255,0.1)] border-solid bottom-[0.9%] left-0 right-0 rounded-[10px] top-[70.79%]" data-node-id="101:2525" />
      <div className="absolute contents inset-[87.42%_4.57%_4.49%_73.14%]" data-node-id="101:2508">
        <div className="absolute bg-[#7b2eff] inset-[87.42%_4.57%_4.49%_73.14%] rounded-[24px]" data-node-id="101:2509" />
        <div className="absolute flex flex-col font-['Montserrat:SemiBold',sans-serif] font-semibold inset-[89.89%_10.86%_6.74%_79.71%] justify-center leading-[0] text-[12px] text-center text-white whitespace-nowrap" data-node-id="101:2510">
          <p className="leading-[normal]">Paint</p>
        </div>
      </div>
      <div className="absolute aspect-[1440/1440] left-0 right-0 rounded-[4px] top-0" data-name="IMG_6407" data-node-id="101:2511">
        <Image alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[4px] size-full" src={imgImg6407} width={350} height={315} />
      </div>
      <div className="absolute flex flex-col font-['Montserrat:Medium','Noto_Sans_JP:Regular',sans-serif] font-medium inset-[82.25%_48%_13.93%_4.57%] justify-center leading-[0] text-[14px] text-white whitespace-nowrap" data-node-id="101:2523">
        <p className="leading-[normal]">Day 24｜Spring Garden</p>
      </div>
      <div className="absolute contents left-[15px] top-[391px]" data-node-id="101:2865">
        <div className="absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal inset-[87.86%_84.57%_8.76%_9.43%] justify-center leading-[0] opacity-40 text-[12px] text-white whitespace-nowrap" data-node-id="101:2668">
          <p className="leading-[normal]">100</p>
        </div>
        <div className="absolute left-[15px] size-[14px] top-[391px]" data-name="实景酷-人数 1" data-node-id="101:3045">
          <Image alt="" className="block max-w-none size-full" src={img1} width={14} height={14} />
        </div>
      </div>
      <div className="absolute flex flex-col font-['Montserrat:Regular',sans-serif] font-normal inset-[87.86%_56.29%_8.76%_18.57%] justify-center leading-[0] opacity-40 text-[12px] text-white whitespace-nowrap" data-node-id="101:3074">
        <p className="leading-[normal]">Painting now...</p>
      </div>
      <div className="absolute inset-[93.03%_72.29%_3.37%_4.57%]" data-node-id="101:2537">
        <Image alt="" className="block max-w-none size-full" src={imgGroup89} width={81} height={16} />
      </div>
    </div>
  );
}

export default Group;
