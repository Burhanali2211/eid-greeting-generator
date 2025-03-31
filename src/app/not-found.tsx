import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-8">
        <Image
          src="/images/crescent-moon.svg"
          alt="Crescent Moon"
          width={80}
          height={80}
          className="opacity-70"
        />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-eid-gold-600">
        Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        We couldn't find the greeting you're looking for. It may have been deleted or the link is incorrect.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button size="lg">
            Create New Greeting
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
} 