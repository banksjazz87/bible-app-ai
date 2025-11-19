'use server'

import Link from 'next/link';

export default async function Home() {
  return (
		<div className="flex flex-col justify-center align-middle h-dvh ">
			<main className="flex flex-col items-center justify-center gap-7">
        <h1 className="font-mono font-extrabold text-5xl text-center">Welcome to the Bible App!</h1>
        <p className="font-mono">
					{`Have you ever dreamed of using AI to assist in crafting your next sermon, but still want to add your unique perspective and personal touch? What if you could effortlessly view multiple versions of the Bible side by side, all in one place,
					to deepen your understanding and enhance your message? Well, you're in the perfect spot! With our tool, you can seamlessly combine the power of AI with your own insights, all while exploring scripture in various translations, making your
					sermon preparation easier, faster, and more meaningful. Plus, it's absolutely free to get started! Let’s dive in and make your next sermon stand out!`}
        </p>
        <Link
          href='/bible'
          className='bg-zinc-900 hover:bg-zinc-800 py-3 px-6 flex flex-row justify-center rounded-md min-w-40'
        >
          <p className="font-mono text-3x font-semibold text-white">Get Started</p>
        </Link>
			</main>
		</div>
	);
}
