import DirectoryBrowser from "@/components/DirectoryBrowser";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <DirectoryBrowser></DirectoryBrowser>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        Alien Poo
      </footer>
    </div>
  );
}
