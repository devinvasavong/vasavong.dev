import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Links - Devin Vasavong",
    description: "Find Devin Vasavong on social media and other platforms.",

    openGraph: {
        title: "Links - Devin Vasavong",
        description: "Find Devin Vasavong on social media and other platforms.",
        url: "https://vasavong.dev/links",
        type: "website",
    },

    twitter: {
        card: "summary",
        title: "Links - Devin Vasavong",
        description: "Find Devin Vasavong on social media and other platforms.",
        creator: "@devinvasavong",
    },

    alternates: {
        canonical: "https://vasavong.dev/links",
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
};

const links = [
    {
        category: "Social",
        items: [
            { label: "Instagram", href: "https://www.instagram.com/cdvasavong" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/devinvasavong" },
        ],
    },
    {
        category: "Work",
        items: [
            { label: "GitHub", href: "https://github.com/devinvasavong" },
        ],
    },
];

export default function LinksPage() {
    return (
        <div className="w-screen h-screen text-sm">
            <div className="max-w-4xl mx-auto p-6">
                <header className="md:mt-12">
                    <h1 className="leading-6.25 font-medium selection:bg-(--selection-color)">Links</h1>
                </header>
                <article>
                    {links.map((group) => (
                        <section key={group.category} className="mt-12">
                            <h3 className="font-medium text-(--subtitle-color) w-full border-b border-(--selection-color) pb-2">
                                {group.category}
                            </h3>
                            <ul className="posts-list">
                                {group.items.map((item, index) => {
                                    const isLast = index === group.items.length - 1;
                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="post relative flex items-center font-medium py-2"
                                            >
                                                <span>{item.label}</span>
                                                {!isLast && (
                                                    <span
                                                        aria-hidden="true"
                                                        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-(--selection-color)"
                                                    />
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    ))}
                </article>
            </div>
        </div>
    );
}
