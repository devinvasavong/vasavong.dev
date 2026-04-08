import { getPostBySlug, getPostBySlugs } from "@/lib/posts.server";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ReactNode } from "react";

type Params = { slug: string };
type PostPageProps = { params: Promise<Params> };
type PostHeading = {
    level: number;
    text: string;
    id: string;
};

function slugify(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[`*_~[\]()<>{}|]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function extractHeadings(markdown: string): PostHeading[] {
    const counts = new Map<string, number>();
    const headings: PostHeading[] = [];
    const lines = markdown.split("\n");

    for (const line of lines) {
        const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
        if (!match) {
            continue;
        }

        const level = match[1].length;
        const text = match[2].trim();
        const base = slugify(text) || "section";
        const count = counts.get(base) ?? 0;
        counts.set(base, count + 1);
        const id = count === 0 ? base : `${base}-${count}`;

        headings.push({ level, text, id });
    }

    return headings;
}

function textFromReactNode(node: ReactNode): string {
    if (typeof node === "string" || typeof node === "number") {
        return String(node);
    }

    if (Array.isArray(node)) {
        return node.map((child) => textFromReactNode(child)).join("");
    }

    if (node && typeof node === "object" && "props" in node) {
        const candidate = node as { props?: { children?: ReactNode } };
        return textFromReactNode(candidate.props?.children);
    }

    return "";
}

function getFirstMarkdownImageSrc(markdown: string): string | null {
    const match = markdown.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/);
    return match?.[1] ?? null;
}

function toAbsoluteUrl(siteUrl: string, maybePath: string): string {
    if (/^https?:\/\//i.test(maybePath)) {
        return maybePath;
    }

    const normalizedPath = maybePath.startsWith("/") ? maybePath : `/${maybePath}`;
    return `${siteUrl.replace(/\/$/, "")}${normalizedPath}`;
}

function stripMarkdown(markdown: string): string {
    return markdown
        .split("\n")
        .map((line) =>
            line
                // Remove blockquote markers
                .replace(/^>\s*/, "")
                // Remove heading markers
                .replace(/^#{1,6}\s+/, "")
                // Remove horizontal rules
                .replace(/^[-*_]{3,}\s*$/, "")
                // Remove fenced code blocks
                .replace(/^```[^\n]*$/, "")
        )
        .join(" ")
        // Remove inline code, keeping the inner text
        .replace(/`([^`]*?)`/g, "$1")
        // Remove bold/italic markers (longest to shortest to avoid partial matches)
        .replace(/\*{3}(.+?)\*{3}/g, "$1")
        .replace(/_{3}(.+?)_{3}/g, "$1")
        .replace(/\*{2}(.+?)\*{2}/g, "$1")
        .replace(/_{2}(.+?)_{2}/g, "$1")
        .replace(/\*(.+?)\*/g, "$1")
        .replace(/_(.+?)_/g, "$1")
        // Remove images
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        // Remove links, keeping display text
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        // Remove HTML tags
        .replace(/<[^>]+>/g, "")
        // Collapse whitespace
        .replace(/\s+/g, " ")
        .trim();
}

export async function generateStaticParams() {
    return getPostBySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug)

    if (!post) {
        return {
            title: "Post Not Found",
            description: "The post you are looking for does not exist."
        }
    }

    const cleaned = stripMarkdown(post.content);
    const description = post.subtitle ? post.subtitle : cleaned.slice(0, 160).trimEnd() + (cleaned.length > 160 ? "..." : "");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://vasavong.dev";
    const postUrl = `${siteUrl}/posts/${post.slug}`;
    const firstImage = getFirstMarkdownImageSrc(post.content);
    const openGraphImage = firstImage ? toAbsoluteUrl(siteUrl, firstImage) : undefined;

    const metadata: Metadata = {
        title: post.title,
        description: description,

        openGraph: {
            title: post.title,
            description: description,
            url: postUrl,
            type: "article",
            publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
            images: openGraphImage ? [openGraphImage] : undefined,
        },

        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: description,
            creator: "@devinvasavong",
            images: openGraphImage ? [openGraphImage] : undefined,
        },

        alternates: {
            canonical: postUrl,
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            }
        }
    }

    return metadata;
}

export default async function Page({ params }: PostPageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug)
    if (!post) {
        return notFound();
    }
    const headings = extractHeadings(post.content);
    const renderedHeadingCounts = new Map<string, number>();
    const nextHeadingId = (children: ReactNode) => {
        const text = textFromReactNode(children).trim();
        const base = slugify(text) || "section";
        const count = renderedHeadingCounts.get(base) ?? 0;
        renderedHeadingCounts.set(base, count + 1);
        return count === 0 ? base : `${base}-${count}`;
    };
    const renderCode = ({ className, children, ...props }: { className?: string; children?: ReactNode }) => {
        const value = textFromReactNode(children);
        const match = /language-([^\s]+)/.exec(className ?? "");
        const language = match?.[1]?.toLowerCase() ?? null;
        const blockCode = Boolean(language) || value.includes("\n");

        if (!blockCode) {
            return (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        }

        return (
            <div className="md-code-block">
                <pre className="md-code-pre">
                    <code className={className} {...props}>
                        {value.replace(/\n$/, "")}
                    </code>
                </pre>
            </div>
        );
    };

    const renderBlockquote = ({ children }: { children?: ReactNode }) => (
        <blockquote className="md-blockquote">{children}</blockquote>
    );

    return (
        <div className="w-screen min-h-screen text-sm">
            <div className="max-w-6xl mx-auto p-6 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
                <aside className="md:mt-12 hidden lg:block lg:sticky lg:top-10 self-start">
                    {headings.length > 0 && (
                        <>
                            <p className="text-sm mb-2" style={{ color: "var(--subtitle-color)", fontWeight: "500" }}>Index</p>
                            <ul className="toc-list">
                                {headings.map((heading) => (
                                    <li key={heading.id} className={`toc-level-${heading.level}`}>
                                        <a className="toc-link text-sm" href={`#${heading.id}`}>{heading.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </aside>
                <div>
                    <Link href="/">
                        <aside className="md:mt-12 flex items-center gap-2 text-sm" style={{ color: "var(--subtitle-color)" }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 4L1.5 8M1.5 8L5.5 12M1.5 8H10C11.3807 8 12.5 6.88071 12.5 5.5V5.5C12.5 4.11929 11.3807 3 10 3H8.5" stroke="var(--subtitle-color)"></path></svg>
                            Return
                        </aside>
                    </Link>
                    <header className="mt-4">
                        <h1 className="leading-[25px] font-[500] selection:bg-[var(--selection-color)]" style={{ color: "var(--heading-color)" }}>{post.title}</h1>
                        <p className="text-sm" style={{ color: "var(--subtitle-color)", fontWeight: "500" }}>
                            {/* spelt out like March 15, 2023 */}
                            {post.date ? new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}
                        </p>
                    </header>
                    <article className="post-content mt-4" style={{ color: "var(--heading-color)", fontWeight: "400" }}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ children }) => <h1 id={nextHeadingId(children)}>{children}</h1>,
                                h2: ({ children }) => <h2 id={nextHeadingId(children)}>{children}</h2>,
                                h3: ({ children }) => <h3 id={nextHeadingId(children)}>{children}</h3>,
                                h4: ({ children }) => <h4 id={nextHeadingId(children)}>{children}</h4>,
                                h5: ({ children }) => <h5 id={nextHeadingId(children)}>{children}</h5>,
                                h6: ({ children }) => <h6 id={nextHeadingId(children)}>{children}</h6>,
                                code: renderCode,
                                blockquote: renderBlockquote,
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </article>
                </div>
            </div>
        </div >
    )
}
