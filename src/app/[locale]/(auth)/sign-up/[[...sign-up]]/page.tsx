import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex justify-center w-full">
      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-transparent shadow-none w-full border-0 p-0",
            headerTitle: "font-syne text-2xl font-bold text-white",
            headerSubtitle: "text-gray-400 font-inter",
            socialButtonsBlockButton: "border-white/10 text-white hover:bg-white/5 transition-colors",
            socialButtonsBlockButtonText: "font-medium text-sm",
            dividerLine: "bg-white/10",
            dividerText: "text-gray-500",
            formFieldLabel: "text-gray-300 font-medium",
            formFieldInput: "bg-black/40 border-white/10 text-white rounded-lg focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all",
            formButtonPrimary: "bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 text-white font-medium shadow-[0_0_15px_rgba(79,142,247,0.3)] transition-all",
            footerActionText: "text-gray-400",
            footerActionLink: "text-neon-blue hover:text-neon-purple transition-colors",
            identityPreviewText: "text-white",
            identityPreviewEditButtonIcon: "text-neon-blue",
          },
        }}
      />
    </div>
  );
}
