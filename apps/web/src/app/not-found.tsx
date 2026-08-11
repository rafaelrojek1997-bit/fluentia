import Link from "next/link";
export default function NotFound(){return <main className="onboarding"><div className="card" style={{maxWidth:520,textAlign:"center"}}><p className="eyebrow">404</p><h1>Nie znaleźliśmy tej strony</h1><p className="muted">Link mógł wygasnąć albo strona została przeniesiona.</p><Link className="button primary" href="/dashboard">Wróć do planu</Link></div></main>}
