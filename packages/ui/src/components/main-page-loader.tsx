import NextTopLoader from "nextjs-toploader";

export const MainPageLoader = () => {
  return (
    <NextTopLoader
      color="#9567eb"
      initialPosition={0.08}
      crawlSpeed={200}
      height={5}
      crawl={true}
      showSpinner={true}
      easing="ease"
      speed={200}
    />
  );
};
