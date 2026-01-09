import { Button } from "@/components/ui/Button";
import { ButtonOutline } from "@/components/ui/ButtonOutline";
import PageLink from "@/components/ui/PageLink";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-row items-center gap-4 bg-white dark:bg-black p-4 rounded-lg">
        <PageLink href="/">PageLink</PageLink>
        <Button size="lg">Button</Button>
        <ButtonOutline size="lg">Button Outline</ButtonOutline>
      </div>
    </div>
  );
}
