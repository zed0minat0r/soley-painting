import Navbar from './components/Navbar'
import Hero3D from './components/Hero3D'
import ServicesMarquee from './components/ServicesMarquee'
import SectionDivider from './components/SectionDivider'
import ServicesScrollLock from './components/ServicesScrollLock'
import Process from './components/Process'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollRevealObserver from './components/ScrollRevealObserver'

export default function Home() {
  return (
    <>
      <ScrollRevealObserver />
      <Navbar />
      <Hero3D />
      <SectionDivider />
      <ServicesMarquee />
      <ServicesScrollLock />
      <SectionDivider flip />
      <Process />
      <SectionDivider />
      <Contact />
      <Footer />
    </>
  )
}
