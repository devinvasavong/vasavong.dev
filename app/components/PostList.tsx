import { getAllPosts } from "@/lib/posts.server"
import Link from "next/link";

export default function PostList() {
    const posts = getAllPosts();
    const publishedPosts = posts.map(post => post.publish ? post : null).filter((post): post is NonNullable<typeof post> => post !== null);

    if (publishedPosts.length > 0) {
        return (
            <section className="mt-12">
                <h3 className="font-[500] text-(--subtitle-color) w-full border-b border-(--selection-color) pb-2">Articles</h3>
                <ul className="posts-list">
                    {posts.map((post, index) => {
                        const parsedDate = post.date ? new Date(post.date) : null;
                        const hasValidDate = parsedDate !== null && !Number.isNaN(parsedDate.getTime());
                        const year = hasValidDate ? parsedDate.getFullYear().toString() : "";
                        const dayMonth = hasValidDate
                            ? parsedDate.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit" })
                            : "";

                        const prevPost = posts[index - 1];
                        const prevDate = prevPost?.date ? new Date(prevPost.date) : null;
                        const prevHasValidDate = prevDate !== null && !Number.isNaN(prevDate.getTime());
                        const prevYear = prevHasValidDate ? prevDate.getFullYear().toString() : "";
                        const showYear = Boolean(year && year !== prevYear);
                        const isYearBreak = Boolean(showYear && index > 0);
                        const nextPost = posts[index + 1];
                        const nextDate = nextPost?.date ? new Date(nextPost.date) : null;
                        const nextHasValidDate = nextDate !== null && !Number.isNaN(nextDate.getTime());
                        const nextYear = nextHasValidDate ? nextDate.getFullYear().toString() : "";
                        const nextStartsNewYear = Boolean(nextYear && nextYear !== year);
                        const showBottomDivider = index < posts.length - 1 && !nextStartsNewYear;

                        return (
                            <li key={post.slug} className={isYearBreak ? "border-t border-[var(--selection-color)]" : undefined}>
                                <Link
                                    href={`/posts/${post.slug}`}
                                    className="post relative grid grid-cols-[70px_1fr_auto] items-center gap-4 font-[500] py-2"
                                >
                                    <span style={{ color: "var(--subtitle-color)", fontWeight: "500" }}>
                                        {showYear ? year : ""}
                                    </span>
                                    <h2>{post.title}</h2>
                                    <time
                                        dateTime={hasValidDate ? parsedDate.toISOString().slice(0, 10) : ""}
                                        className="tabular-nums"
                                        style={{ color: "var(--subtitle-color)", fontWeight: "500" }}
                                    >
                                        {dayMonth}
                                    </time>
                                    {showBottomDivider && (
                                        <span
                                            aria-hidden="true"
                                            className={`pointer-events-none absolute bottom-0 left-[calc(70px+1rem)] right-0 h-px bg-[var(--selection-color)]`}
                                        />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </section>
        );
    }
}
