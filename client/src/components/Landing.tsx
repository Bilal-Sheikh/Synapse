import { Link } from "@nextui-org/react";
import chattingMedium from "../../src/chatting_medium.jpg";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";

export default function Landing() {
    return (
        <div>
            <section className="w-full pt-12 md:pt-24 lg:pt-32">
                <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
                    <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
                        <div>
                            <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] text-gray-900 dark:text-gray-100">
                                Real-time chat for everyone, everywhere
                            </h1>
                            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl pt-6 dark:text-gray-400">
                                Connect with your friends, family, and
                                colleagues instantly with our user-friendly chat
                                app. Share messages in real-time. <br />
                                No sign up required!
                            </p>
                            <div className="flex md:hidden space-x-4 py-4">
                                <div>
                                    <CreateRoom />
                                </div>
                                <div>
                                    <JoinRoom />
                                </div>
                            </div>
                            <div className="hidden md:flex space-x-4 py-4">
                                <CreateRoom buttonText="Get Started" />
                            </div>
                        </div>
                        <div>
                            <img
                                alt="Chat App"
                                className="mx-auto aspect-[1/1] overflow-hidden rounded-xl object-cover"
                                height="500"
                                src={chattingMedium}
                                width="500"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full py-12 mt-10 md:py-24 lg:py-32 lg:mt-10 bg-gray-100 dark:bg-gray-800">
                <div className="container space-y-12 px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm dark:bg-gray-700">
                                Features
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900 dark:text-gray-100">
                                Everything you need to connect
                            </h2>
                            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                Our chat app is packed with features to help you
                                stay in touch with the people who matter most.
                                No sign up required!
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
                        <div className="grid gap-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                Real-time Messaging
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Send and receive messages instantly. No more
                                waiting for texts to load.
                            </p>
                        </div>
                        <div className="grid gap-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                Group Chats
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Create group chats with up to 500 members.
                                Perfect for coordinating with large teams or
                                families.
                            </p>
                        </div>
                        <div className="grid gap-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                Multimedia Sharing
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Share photos, videos, and other files with ease.
                                You can even send voice messages!
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-40">
                <p className="text-base text-gray-500 dark:text-gray-400">
                    © Synapse. All rights reserved.
                </p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link
                        underline="always"
                        className="text-base hover:underline underline-offset-4 text-gray-900 dark:text-gray-100"
                        href="https://github.com/Bilal-Sheikh/Synapse"
                        target="_blank"
                    >
                        Github
                    </Link>
                    <Link
                        underline="always"
                        className="text-base hover:underline underline-offset-4 text-gray-900 dark:text-gray-100"
                        href="https://bilal-sheikh-portfolio.vercel.app/"
                        target="_blank"
                    >
                        Build By
                    </Link>
                    <Link
                        underline="always"
                        className="text-base hover:underline underline-offset-4 text-gray-900 dark:text-gray-100"
                        href="https://socket.io/"
                        target="_blank"
                    >
                        Socket.IO
                    </Link>
                    <Link
                        underline="always"
                        className="text-base hover:underline underline-offset-4 text-gray-900 dark:text-gray-100"
                        href="https://nextui.org/"
                        target="_blank"
                    >
                        Next UI
                    </Link>
                </nav>
            </footer>
        </div>
    );
}
