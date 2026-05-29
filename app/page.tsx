import Navbar from './components/Navbar'
import Hero3D from './components/Hero3D'
import ServicesScrollLock from './components/ServicesScrollLock'
import PaintFlow from './components/PaintFlow'
import WhySoley from './components/WhySoley'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import PaintEdge from './components/PaintEdge'
import ScrollRevealObserver from './components/ScrollRevealObserver'

export default function Home() {
  return (
    <>
      <ScrollRevealObserver />
      <Navbar />
      <Hero3D />
      <ServicesScrollLock />
      <PaintFlow />
      {/* PaintFlow (umber) → WhySoley (chalk) */}
      <PaintEdge variant="dark-to-light" />
      <WhySoley />
      {/* WhySoley (chalk) → FAQ (umber) */}
      <PaintEdge variant="light-to-dark" />
      <FAQ />
      {/* FAQ (umber) → Contact (chalk) */}
      <PaintEdge variant="dark-to-light" />
      <Contact />
      {/* Contact (chalk) → Footer (umber) */}
      <PaintEdge variant="light-to-dark" />
      <Footer />
    </>
  )
}
