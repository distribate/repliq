import { PageWrapper } from "@repo/components/src/wrappers/page-wrapper";
import Image from "next/image";
import EnderDragon from "@repo/assets/gifs/ender-dragon.gif";

export default function LoadingAuthPage() {
  return (
    <PageWrapper className="p-6">
      <div className="flex flex-col items-center justify-center gap-y-1">
        <Image src={EnderDragon} width={400} height={400} alt="loading..." />
      </div>
    </PageWrapper>
  );
}
