import type { Metadata } from "next";
import Link from "next/link";
export const metadata:Metadata={title:"Polityka prywatności Fluentia",robots:{index:true,follow:true}};
export default function PrivacyPolicyPage(){
 const contact=process.env.NEXT_PUBLIC_PRIVACY_EMAIL??"UZUPEŁNIJ_ADRES_EMAIL_PRZED_PUBLIKACJĄ";
 return <main className="app-bg" style={{minHeight:"100vh",padding:"32px 18px"}}><article className="card" style={{maxWidth:880,margin:"0 auto",lineHeight:1.7}}>
  <Link className="brand" href="/">Fluentia</Link><p className="eyebrow" style={{marginTop:28}}>Ostatnia aktualizacja: 5 sierpnia 2026</p><h1>Polityka prywatności</h1>
  <p>Fluentia jest aplikacją do nauki języka angielskiego z mentorem wykorzystującym sztuczną inteligencję. Niniejsza polityka opisuje dane przetwarzane podczas korzystania z aplikacji.</p>
  <h2>Administrator i kontakt</h2><p>Kontakt w sprawach prywatności: <strong>{contact}</strong>.</p>
  <h2>Jakie dane przetwarzamy</h2><ul><li>dane konta, takie jak adres e-mail i ustawienia profilu;</li><li>treści rozmów, korekty, wyniki ćwiczeń i postępy;</li><li>zgody, żądania prywatności i dane techniczne potrzebne do bezpieczeństwa;</li><li>transkrypcję mowy podczas korzystania z mikrofonu.</li></ul>
  <h2>Sztuczna inteligencja i podmioty zewnętrzne</h2><p>Po udzieleniu zgody treść rozmowy jest przesyłana przez zabezpieczony backend Fluentia do OpenAI w celu wygenerowania odpowiedzi, korekt i uporządkowania transkrypcji. Treści przechodzą moderację wejścia i wyjścia.</p>
  <h2>Mikrofon i audio</h2><p>W darmowym trybie przeglądarkowym Fluentia korzysta z rozpoznawania mowy urządzenia lub przeglądarki i nie zapisuje surowego nagrania na swoim serwerze. Dostawca systemu lub przeglądarki może przetwarzać mowę zgodnie z własną polityką. Opcjonalne przechowywanie audio wymaga osobnej zgody.</p>
  <h2>Cele przetwarzania</h2><p>Dane służą do prowadzenia konta, nauki, personalizacji, bezpieczeństwa i realizacji praw użytkownika. Analityka i marketing są opcjonalne oraz zależą od odrębnej zgody, którą można wycofać w ustawieniach.</p>
  <h2>Ochrona i retencja</h2><p>Rozmowy i osobiste materiały są przechowywane w postaci zaszyfrowanej. Dane zachowujemy tylko tak długo, jak jest to potrzebne do działania konta, bezpieczeństwa i obowiązków prawnych. Po zatwierdzeniu żądania usunięcia dane są usuwane lub anonimizowane, poza zakresem wymaganym prawem.</p>
  <h2>Prawa użytkownika</h2><p>Użytkownik może poprawić dane, wycofać zgodę, zażądać eksportu, ograniczenia przetwarzania lub usunięcia konta. Odpowiednie funkcje znajdują się w ustawieniach i na publicznej stronie usunięcia konta.</p>
  <h2>Dzieci</h2><p>Fluentia nie jest obecnie kierowana do dzieci poniżej 13 lat. Docelowa grupa wiekowa zostanie zadeklarowana w Google Play Console.</p>
  <h2>Zmiany polityki</h2><p>O istotnych zmianach poinformujemy w aplikacji. Aktualna data dokumentu znajduje się na początku strony.</p>
  <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:28}}><Link className="button primary" href="/settings">Ustawienia prywatności</Link><Link className="button secondary" href="/account-deletion">Usunięcie konta</Link></div>
 </article></main>;
}
