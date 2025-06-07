import { getItemInfo } from "@/lib/db-services/info-utils";

export default async function Page({ params }: {params: {ID: string}}) {
  const { ID } = await params;
  let gpu: any | null = null;

    gpu = await getItemInfo(ID, 'gpus');

  return (
    <main>
        <h2>{JSON.stringify(gpu)}</h2>
    </main>
  )
}