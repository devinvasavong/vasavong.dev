import { SlotText } from "./components/SlotText";

function WorkCard() {
	return (
		<div className="w-full">

		</div>
	)
}

export default function Page() {
	return (
		<div className="w-screen h-screen bg-[#fafbfe] text-[#061B31]">
			<div className="max-w-xl mx-auto h-full p-12 md:px-0 md:py-12">
				<section id="header" className="flex flex-col items-center md:items-start">
					<h1 className="text-2xl text-center md:text-left text-[#061B31]">
						<SlotText text="devin vasavong" className="title" />
					</h1>
					<p className="text-center md:text-left mt-4 text-lg text-[#061B31] max-w-lg">
						<SlotText
							text="I love all things tech, programming, and startup culture. I'm a current Senior at Rochester Institute of Technology."
							className="description"
							duration={1200}
						/>
					</p>
				</section>
				<section id="wrk" className="mt-12">
					<h2 className="text-xl text-[#061B31] mb-4 text-center md:text-left">
						<SlotText text="my wrk" className="title" duration={1000} />
					</h2>
				</section>
				<section id="posts" className="mt-12">
					<h2 className="text-xl text-[#061B31] mb-4 text-center md:text-left">
						<SlotText text="my posts" className="title" duration={1000} />
					</h2>
				</section>
			</div>
		</div>
	)
}
