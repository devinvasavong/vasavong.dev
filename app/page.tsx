import LinkText from "./components/Link"
import PostList from "./components/PostList";

export default function Page() {
	return (
		<div className="w-screen h-screen text-sm">
			<div className="max-w-4xl mx-auto p-6">
				<nav className="md:mt-12">
					<h1 className="leading-[25px] font-[500] selection:bg-[var(--selection-color)]">Devin Vasavong</h1>
				</nav>
				<article>
					<p className="mt-4 font-[400]">
						Senior college student at <LinkText text="Rochester Institute of Technology" href="https://www.rit.edu" />
						{' '} on co-op at <LinkText text="DEKA Research & Development" href="https://www.dekaresearch.com" />
						.
					</p>
					<p className="mt-4 font-[400]">
						I&apos;m a passionate software engineer with a strong interest in entrepreneurship and would like to
						{' '}pursue a career as a founder or early employee at a startup.
					</p>
				</article>
				<PostList />
			</div>
		</div>
	)
}
