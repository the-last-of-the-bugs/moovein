import { useState } from "react";

const KEYWORDS =
  /\b(import|from|const|let|function|return|export|type|await|async|new|if|else|for|of|class)\b/g;

function highlight(line: string) {
  const parts: { text: string; kind: string }[] = [];
  const push = (text: string, kind = "plain") => text && parts.push({ text, kind });

  if (line.trim().startsWith("//")) {
    push(line, "comment");
    return parts;
  }

  const regex = /("[^"]*"|'[^']*'|`[^`]*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(line))) {
    push(line.slice(last, m.index));
    if (m[1]) push(m[1], "string");
    else if (m[2]) push(m[2], "number");
    else {
      const word = m[3]!;
      KEYWORDS.lastIndex = 0;
      if (KEYWORDS.test(word)) push(word, "keyword");
      else if (line[regex.lastIndex] === "(") push(word, "fn");
      else push(word);
    }
    last = regex.lastIndex;
  }
  push(line.slice(last));
  return parts;
}

const kindClass: Record<string, string> = {
  plain: "text-foreground/85",
  keyword: "text-violet",
  string: "text-brand",
  number: "text-cyan",
  fn: "text-cyan",
  comment: "text-muted-foreground italic",
};

export function CodeBlock({
  code,
  filename,
  className = "",
}: {
  code: string;
  filename?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border bg-code ${className}`}
    >
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-destructive/70" />
          <span className="size-2.5 rounded-full bg-cyan/60" />
          <span className="size-2.5 rounded-full bg-brand/70" />
          {filename ? (
            <span className="ml-2 font-mono text-xs text-muted-foreground">{filename}</span>
          ) : null}
        </div>
        <button
          onClick={copy}
          className="rounded-md px-2 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-brand"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed sm:text-sm">
        <code>
          {code.split("\n").map((line, i) => (
            <div key={i} className="whitespace-pre">
              {highlight(line).map((p, j) => (
                <span key={j} className={kindClass[p.kind]}>
                  {p.text}
                </span>
              ))}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
