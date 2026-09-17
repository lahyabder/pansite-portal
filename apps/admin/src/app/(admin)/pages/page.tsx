import PageList from "@/components/pages/PageList";

export default function PagesPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-outfit text-3xl font-black text-slate-900">Gestion des Pages</h1>
        <p className="text-slate-500 mt-2 font-medium">Créez et gérez les pages de votre écosystème digital.</p>
      </header>

      <PageList />
    </div>
  );
}
