import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";

export const metadata: Metadata = {
  title: { default: "Fluentia — przerwa techniczna", template: "%s | Fluentia" },
  description: "Codzienna, spersonalizowana praktyka angielskiego z mentorem AI.",
  robots: { index: false, follow: false }
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#6757e8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pl" suppressHydrationWarning><body><main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24,background:"#f4f2ff",color:"#242039",fontFamily:"system-ui,sans-serif"}}><section style={{maxWidth:620,textAlign:"center",background:"white",border:"1px solid #ddd8ff",borderRadius:24,padding:"56px 36px",boxShadow:"0 20px 60px rgba(54,44,120,.10)"}}><div style={{width:58,height:58,borderRadius:18,display:"grid",placeItems:"center",margin:"0 auto 24px",background:"#6757e8",color:"white",fontSize:26}}>✦</div><p style={{fontSize:12,letterSpacing:".18em",fontWeight:700,color:"#6757e8"}}>FLUENTIA</p><h1 style={{fontSize:"clamp(34px,7vw,54px)",lineHeight:1.05,margin:"14px 0 20px"}}>Chwila przerwy.</h1><p style={{fontSize:17,lineHeight:1.7,color:"#6d6880",margin:0}}>Aplikacja jest tymczasowo wyłączona. Pracujemy nad kolejną wersją i wrócimy, gdy będzie gotowa.</p></section></main></body></html>;
}
