"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { AiFillFileText, AiFillBulb, AiFillAudio, AiFillStar } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { BiCrown } from "react-icons/bi";
import { useAuthModal } from "../store/useAuthModal";
import { useAuth } from "../lib/AuthProvider";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [activeHeadingIndex, setActiveHeadingIndex] = useState(1); // Start with index 1 (second item)
  const { openModal } = useAuthModal()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeadingIndex((prevIndex) => (prevIndex + 1) % 6); // Cycle through 0-5
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);


  const handleLoginClick = () => {
    if (user) {
      router.push('/for-you')
    }
     else {
      openModal('login')
    }
    
  }

  return (
      <main className="overflow-x-hidden max-w-full font-['Roboto']">
      {/* Navbar */}
      <nav className="nav">
        <div className="nav__wrapper">
          <figure className="nav__img--mask">
            <Image
              src="/assets/logo.png"
              alt="Summarist logo"
              width={200}
              height={80}
              className="nav__img"
              quality={90}
              priority={true}
            />
          </figure>
          <ul className="nav__list--wrapper">
            <li className="nav__list nav__list--login" onClick={handleLoginClick}>Login</li>
            <li className="nav__list nav__list--mobile">About</li>
            <li className="nav__list nav__list--mobile">Contact</li>
            <li className="nav__list nav__list--mobile">Help</li>
          </ul>
        </div>
      </nav>

      {/* Landing Section */}
      <section className="container">
        <div className="row">
          <div className="landing__wrapper">
            <div className="landing__content">
              <h1 className="landing__content__title">
                Gain more knowledge <br /> in less time
              </h1>
              <p className="landing__content__subtitle">
                Great summaries for busy people, <br />
                individuals who barely have time to read, <br />
                and even people who don&apos;t like to read.
              </p>
              <button className="btn home__cta--btn" onClick={handleLoginClick}>Login</button>
            </div>
            <div className="landing__image--mask">
              <Image
                src="/assets/landing.png"
                alt="Person reading book summaries"
                width={400}
                height={400}
                quality={85}
                priority={true}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyziw3yOWSvADU7f5P7pwr8+z6aH/Z"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container">
        <div className="row">
          <div className="section__title">Understand books in few minutes</div>
          <div className="features__wrapper">
            <div className="features">
              <div className="features__icon">
                <AiFillFileText />
              </div>
              <div className="features__title">Read or listen</div>
              <div className="features__sub--title">
                Save time by getting the core ideas from the best books.
              </div>
            </div>
            <div className="features">
              <div className="features__icon">
                <AiFillBulb />
              </div>
              <div className="features__title">Find your next read</div>
              <div className="features__sub--title">
                Explore book lists and personalized recommendations.
              </div>
            </div>
            <div className="features">
              <div className="features__icon">
                <AiFillAudio />
              </div>
              <div className="features__title">Briefcasts</div>
              <div className="features__sub--title">
                Gain valuable insights from briefcasts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container">
        <div className="row">
          <div className="statistics__wrapper">
            <div className="statistics__content--header">
              <div className={`statistics__heading ${activeHeadingIndex === 0 ? 'statistics__heading--active' : ''}`}>Enhance your knowledge</div>
              <div className={`statistics__heading ${activeHeadingIndex === 1 ? 'statistics__heading--active' : ''}`}>Achieve greater success</div>
              <div className={`statistics__heading ${activeHeadingIndex === 2 ? 'statistics__heading--active' : ''}`}>Improve your health</div>
              <div className={`statistics__heading ${activeHeadingIndex === 3 ? 'statistics__heading--active' : ''}`}>Develop better parenting skills</div>
              <div className={`statistics__heading ${activeHeadingIndex === 4 ? 'statistics__heading--active' : ''}`}>Increase happiness</div>
              <div className={`statistics__heading ${activeHeadingIndex === 5 ? 'statistics__heading--active' : ''}`}>Be the best version of yourself!</div>
            </div>
            <div className="statistics__content--details">
              <div className="statistics__data">
                <div className="statistics__data--number">93%</div>
                <div className="statistics__data--title">of Summarist members <strong>significantly increase</strong> reading frequency.</div>
              </div>
              <div className="statistics__data">
                <div className="statistics__data--number">96%</div>
                <div className="statistics__data--title">of Summarist members <strong>establish better habits</strong>.</div>
              </div>
              <div className="statistics__data">
                <div className="statistics__data--number">90%</div>
                <div className="statistics__data--title">have made <strong>significant positive change</strong> to their lives.</div>
              </div>
            </div>
          </div>
          
          <div className="statistics__wrapper">
            <div className="statistics__content--details">
              <div className="statistics__data">
                <div className="statistics__data--number">91%</div>
                <div className="statistics__data--title">of Summarist members <strong>report feeling more productive</strong> after incorporating the service into their daily routine.</div>
              </div>
              <div className="statistics__data">
                <div className="statistics__data--number">94%</div>
                <div className="statistics__data--title">of Summarist members have <strong>noticed an improvement</strong> in their overall comprehension and retention of information.</div>
              </div>
              <div className="statistics__data">
                <div className="statistics__data--number">88%</div>
                <div className="statistics__data--title">of Summarist members <strong>feel more informed</strong> about current events and industry trends since using the platform.</div>
              </div>
            </div>
            <div className="statistics__content--header statistics__content--header-second">
              <div className={`statistics__heading ${activeHeadingIndex === 0 ? 'statistics__heading--active' : ''}`}>Expand your learning</div>
              <div className={`statistics__heading ${activeHeadingIndex === 1 ? 'statistics__heading--active' : ''}`}>Accomplish your goals</div>
              <div className={`statistics__heading ${activeHeadingIndex === 2 ? 'statistics__heading--active' : ''}`}>Strengthen your vitality</div>
              <div className={`statistics__heading ${activeHeadingIndex === 3 ? 'statistics__heading--active' : ''}`}>Become a better caregiver</div>
              <div className={`statistics__heading ${activeHeadingIndex === 4 ? 'statistics__heading--active' : ''}`}>Improve your mood</div>
              <div className={`statistics__heading ${activeHeadingIndex === 5 ? 'statistics__heading--active' : ''}`}>Maximize your abilities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="container">
        <div className="row">
          <div className="section__title">What our members say</div>
          <div className="reviews__wrapper">
            <div className="review">
              <div className="review__header">
                <div className="review__name">Sandrine L.</div>
                <div className="review__stars">
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                </div>
              </div>
              <div className="review__body">
                This app has been a <strong>game-changer</strong> for me! It&apos;s saved me so much time and effort in reading and comprehending books. Highly recommend it to all book lovers.
              </div>
            </div>
            <div className="review">
              <div className="review__header">
                <div className="review__name">Anicet K.</div>
                <div className="review__stars">
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                </div>
              </div>
              <div className="review__body">
                I love this app! It provides <strong>concise and accurate summaries</strong> of books in a way that is easy to understand. It&apos;s also very user-friendly and intuitive.
              </div>
            </div>
            <div className="review">
              <div className="review__header">
                <div className="review__name">Deynah T.</div>
                <div className="review__stars">
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                </div>
              </div>
              <div className="review__body">
                This app is a great way to get the main takeaways from a book without having to read the entire thing. <strong>The summaries are well-written and informative.</strong> Definitely worth downloading.
              </div>
            </div>
            <div className="review">
              <div className="review__header">
                <div className="review__name">Roger P.</div>
                <div className="review__stars">
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                </div>
              </div>
              <div className="review__body">
                If you&apos;re a busy person who <strong>loves reading but doesn&apos;t have the time</strong> to read every book in full, this app is for you! The summaries are thorough and provide a great overview of the book&apos;s content.
              </div>
            </div>
            <div className="reviews__btn--wrapper">
              <button className="btn" onClick={handleLoginClick}>Login</button>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="container">
        <div className="row">
          <div className="section__title">Start growing with Summarist now</div>
          <div className="numbers__wrapper">
            <div className="numbers">
              <div className="numbers__icon">
                <BsPeople />
              </div>
              <div className="numbers__title">3 Million</div>
              <div className="numbers__sub--title">Downloads on all platforms</div>
            </div>
            <div className="numbers">
              <div className="numbers__icon numbers__star--icon">
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
              </div>
              <div className="numbers__title">4.5 Stars</div>
              <div className="numbers__sub--title">Average ratings on iOS and Google Play</div>
            </div>
            <div className="numbers">
              <div className="numbers__icon">
                <BiCrown />
              </div>
              <div className="numbers__title">96%</div>
              <div className="numbers__sub--title">Of Summaris members create a better reading habit</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer">
        <div className="container">
          <div className="row">
            <div className="footer__top--wrapper">
              <div className="footer__block">
                <div className="footer__link--title">Actions</div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">Summaris Magazine</div>
                </div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">Cancel Subscription</div>
                </div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">Help</div>
                </div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">Contact us</div>
                </div>
              </div>
              <div className="footer__block">
                <div className="footer__link--title">Useful Links</div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">Pricing</div>
                </div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">Summaris Business</div>
                </div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">Gift Cards</div>
                </div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">Authors & Publishers</div>
                </div>
              </div>
              <div className="footer__block">
                <div className="footer__link--title">Company</div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">About</div>
                </div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">Careers</div>
                </div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">Partners</div>
                </div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">Code of Conduct</div>
                </div>
              </div>
              <div className="footer__block">
                <div className="footer__link--title">Other</div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">Sitemap</div>
                </div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">Legal Notice</div>
                </div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">Terms of Service</div>
                </div>
                <div className="footer__link--wrapper">
                  <div className="footer__link">Privacy Policies</div>
                </div>
              </div>
            </div>
            <div className="footer__copyright--wrapper">
              <div className="footer__copyright">Copyright © 2025 Summarist.</div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}