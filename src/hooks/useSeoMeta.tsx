import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";

// --- Types ---
export interface MetaEntry {
  name?: string;
  property?: string;
  content?: string;
  [key: string]: any;
}

export interface LinkEntry {
  rel?: string;
  href?: string;
  [key: string]: any;
}

export interface ScriptEntry {
  src?: string;
  async?: boolean;
  defer?: boolean;
  type?: string;
  children?: string;
  [key: string]: any;
}

export interface StyleEntry {
  children?: string;
  [key: string]: any;
}

export interface MetaObject {
  title?: string;
  titleTemplate?: string | ((title?: string) => string);
  base?: { href?: string; target?: string };
  link?: LinkEntry[];
  meta?: MetaEntry[];
  style?: StyleEntry[];
  script?: ScriptEntry[];
  noscript?: { children: string }[];
  htmlAttrs?: Record<string, string>;
  bodyAttrs?: Record<string, string>;
}

export interface SeoMeta {
  title?: string;
  description?: string;
  keywords?: string | string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  [key: string]: any;
}

const SeoContext = createContext<{
  addEntry: (id: string, head: MetaObject) => void;
  removeEntry: (id: string) => void;
  head: MetaObject;
} | null>(null);

export function mergeHead(prev: MetaObject, next: MetaObject): MetaObject {
  const merged = { ...prev, ...next };
  if (prev.meta && next.meta) merged.meta = [...prev.meta, ...next.meta];
  if (prev.link && next.link) merged.link = [...prev.link, ...next.link];
  if (prev.style && next.style) merged.style = [...prev.style, ...next.style];
  if (prev.script && next.script) merged.script = [...prev.script, ...next.script];
  
  if (next.title === undefined && prev.title !== undefined) merged.title = prev.title;
  if (next.titleTemplate === undefined && prev.titleTemplate !== undefined) merged.titleTemplate = prev.titleTemplate;
  
  return merged;
}

export function renderHeadToString(head: MetaObject): string {
  const elements: string[] = [];
  
  let displayTitle = head.title;
  if (head.titleTemplate && displayTitle) {
    displayTitle = typeof head.titleTemplate === "function" 
      ? head.titleTemplate(displayTitle)
      : head.titleTemplate.replace("%s", displayTitle);
  }
  if (displayTitle) elements.push(`<title data-ssr-head="true">${displayTitle}</title>`);

  if (head.base) {
    const attrs = Object.entries(head.base).map(([k, v]) => `${k}="${v}"`).join(" ");
    elements.push(`<base data-ssr-head="true" ${attrs} />`);
  }

  head.meta?.forEach(m => {
    const attrs = Object.entries(m).map(([k, v]) => `${k}="${v}"`).join(" ");
    elements.push(`<meta data-ssr-head="true" ${attrs} />`);
  });

  head.link?.forEach(l => {
    const attrs = Object.entries(l).map(([k, v]) => `${k}="${v}"`).join(" ");
    elements.push(`<link data-ssr-head="true" ${attrs} />`);
  });

  head.style?.forEach(s => {
    const { children, ...rest } = s;
    const attrs = Object.entries(rest).map(([k, v]) => `${k}="${v}"`).join(" ");
    elements.push(`<style data-ssr-head="true" ${attrs}>${children || ""}</style>`);
  });

  head.script?.forEach(s => {
    const { children, ...rest } = s;
    const attrs = Object.entries(rest).map(([k, v]) => `${k}="${v}"`).join(" ");
    elements.push(`<script data-ssr-head="true" ${attrs}>${children || ""}</script>`);
  });

  head.noscript?.forEach(n => {
    elements.push(`<noscript data-ssr-head="true">${n.children}</noscript>`);
  });

  return elements.join("\n");
}

export function renderAttrsToString(attrs?: Record<string, string>): string {
  if (!attrs) return "";
  return Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(" ");
}

// --- Internal Component to Render Tags (Client) ---
function HeadRenderer({ head }: { head: MetaObject }) {
  const elements: React.ReactNode[] = [];
  
  // Title
  let displayTitle = head.title;
  if (head.titleTemplate && displayTitle) {
    displayTitle = typeof head.titleTemplate === "function" 
      ? head.titleTemplate(displayTitle)
      : head.titleTemplate.replace("%s", displayTitle);
  }
  if (displayTitle) elements.push(<title key="title">{displayTitle}</title>);

  // Base
  if (head.base) elements.push(<base key="base" {...head.base} />);

  // Meta
  head.meta?.forEach((m, i) => {
    elements.push(<meta key={`meta-${i}`} {...m} />);
  });

  // Link
  head.link?.forEach((l, i) => {
    elements.push(<link key={`link-${i}`} {...l} />);
  });

  // Style
  head.style?.forEach((s, i) => {
    const { children, ...rest } = s;
    elements.push(<style key={`style-${i}`} {...rest}>{children}</style>);
  });

  // Script
  head.script?.forEach((s, i) => {
    const { children, ...rest } = s;
    elements.push(<script key={`script-${i}`} {...rest}>{children}</script>);
  });

  // Noscript
  head.noscript?.forEach((n, i) => {
    elements.push(<noscript key={`noscript-${i}`}>{n.children}</noscript>);
  });

  return <>{elements}</>;
}

// --- Provider ---
export function SeoProvider({ children, serverContext }: { children: React.ReactNode, serverContext?: { head: MetaObject } }) {
  const [entries, setEntries] = useState<Record<string, MetaObject>>({});
  const ssrHeadRef = useRef<MetaObject>(serverContext?.head || {});

  const addEntry = (id: string, newHead: MetaObject) => {
    if (typeof window === 'undefined') {
      ssrHeadRef.current = mergeHead(ssrHeadRef.current, newHead);
      if (serverContext) serverContext.head = ssrHeadRef.current;
    } else {
      setEntries(prev => ({ ...prev, [id]: newHead }));
    }
  };

  const removeEntry = (id: string) => {
    setEntries(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // Cleanup SSR tags once client hydrates
  useEffect(() => {
    document.querySelectorAll('[data-ssr-head="true"]').forEach(el => el.remove());
  }, []);

  // Compute merged head on the client
  const currentHead = typeof window === 'undefined' 
    ? ssrHeadRef.current 
    : Object.values(entries).reduce((acc, curr) => mergeHead(acc, curr), {});

  // Effect for htmlAttrs and bodyAttrs (Client only)
  useEffect(() => {
    if (currentHead.htmlAttrs) {
      Object.entries(currentHead.htmlAttrs).forEach(([key, value]) => {
        document.documentElement.setAttribute(key, value);
      });
    }
    if (currentHead.bodyAttrs) {
      Object.entries(currentHead.bodyAttrs).forEach(([key, value]) => {
        document.body.setAttribute(key, value);
      });
    }
  }, [currentHead.htmlAttrs, currentHead.bodyAttrs]);

  return (
    <SeoContext.Provider value={{ addEntry, removeEntry, head: currentHead }}>
      {children}
      {typeof window !== 'undefined' && <HeadRenderer head={currentHead} />}
    </SeoContext.Provider>
  );
}

export function useHead(input: MetaObject | (() => MetaObject)) {
  const id = React.useId();
  const context = useContext(SeoContext);
  if (!context) {
    console.warn("useHead must be used within a SeoProvider");
    return;
  }

  const resolvedInput = typeof input === "function" ? input() : input;

  if (typeof window === "undefined") {
    // SSR: Update immediately so HeadRenderer can see it
    context.addEntry(id, resolvedInput);
  } else {
    useEffect(() => {
      context.addEntry(id, resolvedInput);
      return () => context.removeEntry(id);
    }, [JSON.stringify(resolvedInput)]);
  }
}

export function useSeoMeta(meta: SeoMeta) {
  const head = useMemo(() => {
    const metaEntries: MetaEntry[] = [];
    if (meta.description) metaEntries.push({ name: "description", content: meta.description });
    if (meta.keywords) {
      const content = Array.isArray(meta.keywords) ? meta.keywords.join(", ") : meta.keywords;
      metaEntries.push({ name: "keywords", content });
    }

    const ogMap: Record<string, string | undefined> = {
      "og:title": meta.ogTitle || meta.title,
      "og:description": meta.ogDescription || meta.description,
      "og:image": meta.ogImage,
      "og:url": meta.ogUrl,
      "og:type": meta.ogType || "website",
    };
    Object.entries(ogMap).forEach(([prop, content]) => {
      if (content) metaEntries.push({ property: prop, content });
    });

    const twitterMap: Record<string, string | undefined> = {
      "twitter:card": meta.twitterCard || "summary",
      "twitter:title": meta.twitterTitle || meta.ogTitle || meta.title,
      "twitter:description": meta.twitterDescription || meta.ogDescription || meta.description,
      "twitter:image": meta.twitterImage || meta.ogImage,
    };
    Object.entries(twitterMap).forEach(([name, content]) => {
      if (content) metaEntries.push({ name, content });
    });

    const headObject: MetaObject = { meta: metaEntries };
    if (meta.title) headObject.title = meta.title;

    return headObject;
  }, [JSON.stringify(meta)]);

  useHead(head);
}
