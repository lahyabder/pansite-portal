interface ComingSoonProps {
    message: string;
    description: string;
}

export function ComingSoon({ message, description }: ComingSoonProps) {
    return (
        <section className="py-20 bg-pan-gray-50">
            <div className="max-w-2xl mx-auto px-6 text-center">
                {/* Decorative icon */}
                <div className="w-20 h-20 bg-pan-pale rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <svg className="w-10 h-10 text-pan-sky" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.71 3.12a.75.75 0 01-1.08-.91l2.02-5.97-4.86-3.77a.75.75 0 01.46-1.33l6.07-.25 2.19-5.83a.75.75 0 011.38 0l2.19 5.83 6.07.25a.75.75 0 01.46 1.33l-4.86 3.77 2.02 5.97a.75.75 0 01-1.08.91l-5.71-3.12z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-pan-navy mb-4">{message}</h2>
                <p className="text-pan-gray-500 leading-relaxed">{description}</p>

                {/* Decorative dots */}
                <div className="flex items-center justify-center gap-2 mt-8">
                    <div className="w-2 h-2 bg-pan-sky rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-pan-sky/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-pan-sky/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
            </div>
        </section>
    );
}
