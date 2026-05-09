import Navbar from './components/Navbar'
import Hero3D from './components/Hero3D'
import ServicesMarquee from './components/ServicesMarquee'
import SectionDivider from './components/SectionDivider'
import ServicesScrollLock from './components/ServicesScrollLock'
import PaintFlow from './components/PaintFlow'
import WhySoley from './components/WhySoley'
import FounderBlock from './components/FounderBlock'
import PortfolioGallery from './components/PortfolioGallery'
import FAQ from './components/FAQ'
import NotifySignup from './components/NotifySignup'
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
      <SectionDivider />
      <PaintFlow />
      <SectionDivider />
      <WhySoley />
      <SectionDivider />
      <FounderBlock />
      <SectionDivider />
      <PortfolioGallery />
      <SectionDivider />
      <FAQ />
      <SectionDivider />
      <NotifySignup />
      <SectionDivider />
      <Process />
      <Contact />
      <Footer />
    </>
  )
}
