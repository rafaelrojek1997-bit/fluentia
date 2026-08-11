"use client";
import { useEffect } from "react";
import Link from "next/link";
export default function Home(){useEffect(()=>{window.location.replace("/dashboard")},[]);return <main className="app-bg" style={{minHeight:"100vh",display:"grid",placeItems:"center"}}><Link className="button primary" href="/dashboard">Otwórz Fluentia</Link></main>}
