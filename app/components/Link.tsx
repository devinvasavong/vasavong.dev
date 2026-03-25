import Link from "next/link";

function LinkText({ text, href, className }: { text: string; href: string, className?: string }) {
    return <Link href={href} className={className}>
        {text}
    </Link>
}

export default LinkText;