"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Calendar, Check, Clock, Share2 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Greeting, getSenderGreetings } from "@/lib/supabase";
import { useUserStore, useGreetingStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export function SenderDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const userId = useUserStore((state) => state.userId);
  const greetings = useGreetingStore((state) => state.greetings);
  const setGreetings = useGreetingStore((state) => state.setGreetings);
  const updateGreeting = useGreetingStore((state) => state.updateGreeting);

  // Load sender's greetings
  useEffect(() => {
    const loadGreetings = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await getSenderGreetings(userId);
        if (error) throw new Error(error.message);
        if (data) {
          setGreetings(data);
        }
      } catch (error) {
        console.error("Error loading greetings:", error);
        toast.error("Failed to load your greetings");
      } finally {
        setIsLoading(false);
      }
    };

    loadGreetings();
  }, [userId, setGreetings]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!userId) return;

    const subscription = supabase
      .channel("greetings-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "greetings",
          filter: `sender_id=eq.${userId}`,
        },
        (payload) => {
          updateGreeting(payload.new as Greeting);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, updateGreeting]);

  // Share greeting
  const handleShare = (greeting: Greeting) => {
    const url = `${window.location.origin}/greeting/${greeting.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: "Eid Greeting",
          text: `I've sent you an Eid greeting with Eidi! Check it out!`,
          url,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  if (isLoading) {
    return <div className="text-center">Loading your greetings...</div>;
  }

  if (!userId) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>No Greetings Found</CardTitle>
          <CardDescription>
            You need to create a greeting first to see your dashboard.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/" className="w-full">
            <Button className="w-full">Create Your First Greeting</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (greetings.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>No Greetings Yet</CardTitle>
          <CardDescription>
            You haven't created any Eid greetings yet.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/" className="w-full">
            <Button className="w-full">Create Your First Greeting</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-eid-emerald-700">Your Eid Greetings</h2>
        <Link href="/">
          <Button>Create New Greeting</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {greetings.map((greeting) => (
          <Card key={greeting.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">
                To: {greeting.recipient_name}
              </CardTitle>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(greeting.created_at)}</span>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="line-clamp-2 text-gray-600">{greeting.message}</p>
              <div className="mt-2 flex items-center">
                <span className="text-sm font-medium mr-2">Status:</span>
                {greeting.selected_card !== null ? (
                  <span className="inline-flex items-center text-eid-emerald-600">
                    <Check className="h-4 w-4 mr-1" />
                    Claimed (Amount: {greeting.amounts[greeting.selected_card]})
                  </span>
                ) : (
                  <span className="inline-flex items-center text-eid-gold-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Pending
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Link href={`/greeting/${greeting.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(greeting)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 