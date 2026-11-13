import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { About, Projects, Skills, Contact } from "@/components/Sections";
export default function Home() {
  return (<><Navbar /><main><Hero /><About /><Projects /><Skills /><Contact /></main><Footer /></>);
}
