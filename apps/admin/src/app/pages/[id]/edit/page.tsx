import PageEditor from "@/components/pages/PageEditor";
import { getPageByIdAction } from "@/app/actions";
import { notFound } from "next/navigation";

export default async function EditPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const page = await getPageByIdAction(id);

  if (!page) {
    notFound();
  }

  return <PageEditor initialData={page} id={id} />;
}
