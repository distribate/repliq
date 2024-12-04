import NextTopLoader from "nextjs-toploader";

export const MainPageLoader = () => {
  return (
    <NextTopLoader
      color="#4f4f4f"
      initialPosition={0.08}
      crawlSpeed={200}
      height={5}
      crawl={true}
      showSpinner={true}
      easing="ease"
      speed={200}
      shadow="0 0 10px #00cdb0,0 0 5px #00cdb0"
    />
  );
};
