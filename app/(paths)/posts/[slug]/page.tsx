import { getPostBySlug, getPostBySlugs } from "@/lib/posts.server";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { slug: string };
type PostPageProps = { params: Promise<Params> };

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

    const description = post.subtitle ? post.subtitle : post.content.slice(0, 160).replace(/\n/g, " ") + "...";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://vasavong.dev";
    const postUrl = `${siteUrl}/posts/${post.slug}`;

    const metadata: Metadata = {
        title: post.title,
        description: description,

        openGraph: {
            title: post.title,
            description: description,
            url: postUrl,
            type: "article",
            publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
        },

        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: description,
            creator: "@devinvasavong",
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

    return (
        <div className="w-screen h-screen">
            <div className="max-w-4xl mx-auto p-6">
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
                <article className="mt-4 whitespace-pre-wrap" style={{ color: "var(--heading-color)", fontWeight: "400" }}>{post.content}</article>
            </div>
        </div >
    )
}
