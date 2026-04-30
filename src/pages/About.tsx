import { useRequest } from "@/hooks/useRequest";
import { useSeoMeta, useHead } from "@/hooks/useSeoMeta";

interface Todo {
  id: number;
  name: string;
  email: string
}

export const meta = {
  title: "About",
  description: "About This Project",
  keywords: ["About", "This", "Project"],
}

export const getServerSide = async () => {
  const { res } = await useRequest<Todo[]>('/api/comments', {
    query: {
      postId: 2
    }
  });
  return res;
};

export default function About({ data: todo }: { data: Todo[] }) {
  // Demo useHead
  useHead({
    title: todo ? todo[0]?.name : "About",
    titleTemplate: "%s | Bun React Project",
    bodyAttrs: {
      class: "about-page-bg",
      "data-page": "about"
    },
    link: [
      { rel: "canonical", href: "http://localhost:3000/about" }
    ]
  });

  // Demo useSeoMeta
  useSeoMeta({
    description: todo ? `Viewing task: ${todo[0]?.name}` : "About our project",
    ogImage: "https://bun.sh/logo.svg",
    twitterCard: "summary_large_image",
  });

  return (
    <div className="p-8 max-w-2xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">About This Project</h1>

      <div className="bg-[#18181b] border border-white/10 rounded-xl p-6 shadow-xl mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">SSR Data Fetching</h2>

        {todo ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">
              Data fetched on <strong>Server</strong> via <code className="bg-black/30 px-1 rounded">getServerSide</code>:
            </p>
            {todo?.map((item) => (
              <div key={item?.id} className="bg-black/20 p-4 rounded-lg border border-white/5">
                <p><span className="text-gray-500">Title:</span> {item.name}</p>
                <p><span className="text-gray-500">Status:</span> {item.email ? "✅ Completed" : "⏳ Pending"}</p>
              </div>
            ))}

          </div>
        ) : (
          <p className="text-red-400">No data available. Make sure the proxy is running.</p>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-gray-300">
          This page demonstrates <strong>Server-Side Rendering (SSR)</strong>.
          The data above was fetched before the page was sent to your browser,
          eliminating any "loading" flicker.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Tech Stack</h3>
            <ul className="text-sm text-gray-400 list-disc list-inside">
              <li>Bun (Runtime & Bundler)</li>
              <li>React 19</li>
              <li>TanStack Router</li>
              <li>TypeScript</li>
            </ul>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Benefits</h3>
            <ul className="text-sm text-gray-400 list-disc list-inside">
              <li>Better SEO</li>
              <li>Faster FCP</li>
              <li>No Hydration Flicker</li>
              <li>Clean Component Code</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
