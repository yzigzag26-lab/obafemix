import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import AiChat from "@/components/AiChat";
import { About, Projects, Skills, Contact } from "@/components/Sections";
export default function Home() {
  return (<><Navbar /><main><Hero /><About /><Projects /><Skills /><Contact /></main><Footer /><AiChat /></>);
}
