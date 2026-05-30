"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Offerings from "@/components/sections/Offerings";
import Events from "@/components/sections/Events";
import Instagram from "@/components/sections/Instagram";
import Gallery from "@/components/sections/Gallery";
import HeadshopCTA from "@/components/sections/HeadshopCTA";
import FindUs from "@/components/sections/FindUs";
import ChatWidget from "@/components/chat/ChatWidget";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <Navbar onChatOpen={() => setChatOpen(true)} />
      <main>
        <Hero onChatOpen={() => setChatOpen(true)} />
        <Offerings />
        <Events />
        <Instagram />
        <Gallery />
        <HeadshopCTA />
        <FindUs />
      </main>
      <Footer />
      <ChatWidget
        isOpen={chatOpen}
        onOpen={() => setChatOpen(true)}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
}
