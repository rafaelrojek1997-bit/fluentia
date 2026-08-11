"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api-client";

const schema = z.object({
  email: z.string().email("Podaj poprawny adres e-mail"),
  password: z.string().min(12, "Hasło musi mieć co najmniej 12 znaków").max(128),
  terms: z.literal(true, { error: "Zaakceptuj regulamin i politykę prywatności" })
});
type Form = z.infer<typeof schema>;

export default function SignUp() {
  const router = useRouter(); const { register: createAccount } = useAuth(); const [serverError, setServerError] = useState("");
  const form = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { terms: false as true } });
  const submit = form.handleSubmit(async data => {
    setServerError("");
    try { await createAccount(data.email, data.password); router.push("/onboarding"); }
    catch (error) { setServerError(error instanceof ApiError && error.problem.code === "EMAIL_ALREADY_REGISTERED" ? "Konto z tym adresem już istnieje." : error instanceof Error ? error.message : "Nie udało się utworzyć konta."); }
  });
  return <div className="auth-page"><section className="auth-art"><div className="brand" style={{padding:0,color:"white"}}><span className="brand-mark" style={{background:"rgba(255,255,255,.18)"}}><Sparkles/></span>Fluentia</div><div><h1>Zacznij mówić po angielsku z większą pewnością.</h1><p style={{lineHeight:1.7,color:"rgba(255,255,255,.8)"}}>Utwórz konto, wybierz poziom lub wykonaj diagnozę i rozpocznij prawdziwą rozmowę z mentorem AI.</p></div></section><main className="auth-panel"><div className="auth-box"><h1>Utwórz konto</h1><form className="form" onSubmit={submit}><div className="field"><label htmlFor="email">E-mail</label><input className="input" id="email" type="email" autoComplete="email" {...form.register("email")}/>{form.formState.errors.email&&<span className="error">{form.formState.errors.email.message}</span>}</div><div className="field"><label htmlFor="password">Hasło</label><input className="input" id="password" type="password" autoComplete="new-password" {...form.register("password")}/>{form.formState.errors.password&&<span className="error">{form.formState.errors.password.message}</span>}</div><label style={{display:"flex",gap:10,alignItems:"flex-start",fontSize:13}}><input type="checkbox" {...form.register("terms")}/> Akceptuję regulamin i politykę prywatności.</label>{form.formState.errors.terms&&<span className="error">{form.formState.errors.terms.message}</span>}{serverError&&<div className="error" role="alert">{serverError}</div>}<button className="button primary" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting?"Tworzenie konta…":"Utwórz konto"}</button></form><p className="muted" style={{textAlign:"center",marginTop:20}}>Masz konto? <Link href="/sign-in">Zaloguj się</Link></p></div></main></div>;
}
