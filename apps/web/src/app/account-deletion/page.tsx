import type { Metadata } from "next";
import Link from "next/link";
export const metadata:Metadata={title:"Usunięcie konta Fluentia",robots:{index:true,follow:true}};
export default function AccountDeletionPage(){
 const contact=process.env.NEXT_PUBLIC_PRIVACY_EMAIL??"UZUPEŁNIJ_ADRES_EMAIL_PRZED_PUBLIKACJĄ";
 return <main className="app-bg" style={{minHeight:"100vh",padding:"32px 18px"}}><article className="card" style={{maxWidth:760,margin:"0 auto",lineHeight:1.7}}>
  <Link className="brand" href="/">Fluentia</Link><p className="eyebrow" style={{marginTop:28}}>Zarządzanie kontem</p><h1>Usunięcie konta i danych</h1>
  <p>Możesz złożyć żądanie usunięcia konta Fluentia przez stronę internetową, bez korzystania z aplikacji mobilnej.</p>
  <h2>Jak złożyć żądanie</h2><ol><li>Zaloguj się do konta w serwisie internetowym.</li><li>Otwórz <strong>Ustawienia → Prywatność</strong>.</li><li>Wpisz <strong>USUŃ</strong> i wybierz przycisk złożenia żądania.</li><li>Zapisz wyświetlony numer żądania.</li></ol>
  <p>Logowanie chroni przed usunięciem konta przez inną osobę. Jeśli nie możesz się zalogować, skontaktuj się z nami: <strong>{contact}</strong>.</p>
  <h2>Co zostanie usunięte</h2><ul><li>konto i profil;</li><li>rozmowy, korekty, postępy i materiały osobiste;</li><li>pamięć mentora, plany, powtórki oraz zapisane dane głosowe.</li></ul>
  <h2>Co może zostać zachowane</h2><p>Minimalne dane mogą zostać zachowane, jeśli wymaga tego prawo, bezpieczeństwo lub udokumentowanie realizacji żądania. Nie będą wykorzystywane do nauki ani marketingu.</p>
  <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:28}}><Link className="button primary" href="/sign-in">Zaloguj się i złóż żądanie</Link><Link className="button secondary" href="/privacy-policy">Polityka prywatności</Link></div>
 </article></main>;
}
