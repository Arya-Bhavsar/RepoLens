export default function TypingIndicator() {
    return (
        <div className="flex gap-1 items-center h-4">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse [animation-delay:0ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse [animation-delay:100ms]" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse [animation-delay:200ms]" />
        </div>
    )
}