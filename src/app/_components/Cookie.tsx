import SmoothScroll from "@/components/SmoothScroll";
// Using standard <a> tags to maintain exact behavior of original HTML (empty hrefs) and CSS selectors

export default function Cookie() {
  return (
    <>
      <SmoothScroll />
      <main className="smooth-scroll">
        <section className="hero-section">
            <div className="container">
                <nav>
                    <div className="logo">
                        <a href="">
                            Cooki.co
                        </a>
                    </div>
                    <div className="menu">
                        <ul>
                            <li><a href="">Franchise</a></li>
                            <li><a href="">Catering</a></li>
                            <li><a href="">Shipping</a></li>
                            <li><a href="">Locations</a></li>
                        </ul>
                    </div>
                    <a href="" className="cta-btn">Buy Now</a>
                </nav>
                <div className="hero-content">
                    <h1>Cookie</h1>
                    <img src="/images/cookie.webp" alt="" className="cookie" id="cookie" />
                    <img src="/images/choco-chips.png" className="choco-chips" id="chips" alt="" />
                    <img src="/images/peanut.png" className="peanut" alt="" />
                    <img src="/images/gem.png" className="gem" alt="" />
                </div>
            </div>
        </section>

        <section className="second-section">
            <div className="container">
                <div className="content-wrapper">
                    <div className="img-section"></div>
                    <div className="content-section">
                        <h2>TASTE THE DIFFERENCE.</h2>
                        <div className="sub-heading">Real Eggs, Real Butter, Real Sugar.</div>
                        <p>Cookie Co. was founded in 2020 during the height of the Covid-19 pandemic by Elise and Matt Thomas. Working behind the scenes to open the first Cookie Co. location, Elise baked her signature cookie recipes using real eggs, real butter, and real cane sugar in her home, preparing hundreds of boxes weekly by hand for driveway pick-up. </p>
                    </div>
                </div>
            </div>
        </section>

        <section className="third-section">
            <div className="container">
                <div className="content-wrapper">
                    <div className="product-card">
                        <img src="/images/frosted-sugar.webp" className="cooki-sm" id="cookism" alt="" />
                        <h4>FROSTED SUGAR</h4>
                        <a href="" className="cta-btn">Buy Now</a>
                    </div>
                    <div className="product-card">
                        <h4>MONSTER</h4>
                        <a href="" className="cta-btn">Buy Now</a>
                    </div>
                    <div className="product-card">
                        <img src="/images/oreo.webp" className="cooki-sm" id="cookism" alt="" />
                        <h4>OREO</h4>
                        <a href="" className="cta-btn">Buy Now</a>
                    </div>
                </div>
            </div>
        </section>
      </main>
    </>
  );
}
