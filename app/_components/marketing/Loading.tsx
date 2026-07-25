import Image from 'next/image'

const Loading = () => {
    return (
        <div className="h-screen flex flex-col gap-8 items-center justify-center bg-peach">
            <Image src="/logo.png" alt="FileFlux Logo" width={100} height={100} className="animate-pulse" />
            <h1 className="text-4xl font-medium tracking-wider">FileFlux</h1>
        </div>
    )
}

export default Loading