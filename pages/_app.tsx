import type { AppProps } from "next/app";
import "../src/app/globals.css"; // Import global styles

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
