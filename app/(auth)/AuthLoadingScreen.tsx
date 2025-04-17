import Image from "next/image"

interface AuthLoadingScreenProps {
  type: "signin" | "signup"
}

export default function AuthLoadingScreen({ type }: AuthLoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-[#D1E7FD] z-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-2">
        <Image src="/linktank_logo.png" alt="Linktank" width={100} height={100} className="w-16 h-16 rounded-full" />
        <h2 className="text-2xl font-bold">{type === "signup" ? "Thank you for signing up" : "Welcome back"}</h2>
        <p className="text-lg text-muted-foreground flex items-center gap-1">
          {type === "signup" ? "This will take a few seconds" : "Signing you in"}
          <span className="dots">
            <span className="dot one">.</span>
            <span className="dot two">.</span>
            <span className="dot three">.</span>
          </span>
        </p>
      </div>

      <style jsx>{`
        .dots {
          display: inline-flex;
          margin-left: 4px;
        }

        .dot {
          animation: blink 1.4s infinite;
          font-weight: bold;
        }

        .dot.two {
          animation-delay: 0.2s;
        }

        .dot.three {
          animation-delay: 0.4s;
        }

        @keyframes blink {
          0%,
          80%,
          100% {
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
