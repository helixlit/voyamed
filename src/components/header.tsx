"use client";
import { useModalStore } from "@/utils/ModalState";
import Image from "next/image"
import Link from "next/link"

export default function Header() {
    const open = useModalStore((state) => state.open);

    return (
        <header className='z-100 p-4 font-outfit text-4xl border-foreground border-b-3 flex items-center justify-between sticky top-0 bg-background select-none'>
            <div className="flex items-center">
                <Link href={"/"}>
                    <div className="flex gap-5 items-center align-middle text-cm">
                        <Image
                            src={"/logo.png"}
                            alt=""
                            width={50}
                            height={50}
                            className="hidden md:block"
                        />
                        <h1 className="-translate-y-0.5 ">Voya<span className="text-highlight">med</span></h1>
                    </div>
                </Link>
            </div>
            <div className="flex gap-5">
                <div className="flex items-center">
                    <Link href={"/configurator"}>
                        <h3 className="text-cm text-xs">Konfigurator</h3>
                    </Link>
                </div>
                <div className="flex items-center gap-6 text-xl">
                    <div onClick={() => open("shoppingCart")}
                        className="mt-1 rounded-full hover:shadow-[0_0_0_6px_rgba(255,255,255,0.25)] transition duration-300 hover:bg-white/25">
                        <Image
                            src="/shoppingCart.svg"
                            alt="globe"
                            width={25}
                            height={25}
                            className="brightness-0 dark:brightness-200 hover:brightness-0 dark:hover:brightness-400 transition duration-400 "
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}