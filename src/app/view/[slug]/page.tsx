import { notFound } from "next/navigation";
import InfoCard from "@/components/InfoCard";
import { Paste } from "@/types/database";
import { uuidSecretFromSlug } from "@/utils";
import PasteViewer from "@/components/ViewPage/PasteViewer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getPaste = async (uuid: string): Promise<{
  paste: Paste | null;
  error: string | null;
  status: number | null;
}> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/paste/${uuid}`, {
      cache: "force-cache",
    });

    if (!res.ok) {
      if (res.status === 404) return { paste: null, error: null, status: 404 };
      return { paste: null, error: "Server error. Please try again later.", status: res.status };
    }

    const paste = await res.json();
    return { paste, error: null, status: 200 };
  } catch (err) {
    console.log(err)
    return { paste: null, error: "Unexpected error. Please check your connection.", status: null };
  }
};

export default async function ViewPage({ params }: PageProps) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const { uuid, secret } = uuidSecretFromSlug(decodedSlug)

  const { paste, error, status } = await getPaste(uuid);

  // Handle paste not found
  if (!paste || status === 404) {
    notFound()
  }
 

  return (
    <div className="py-6 space-y-4">
      {error && (
        <InfoCard variant="error">{error}</InfoCard>
      )}
      {paste && (
        <PasteViewer 
          paste={paste}
          secret={secret}
        />
      )}
    </div>
  );
}
