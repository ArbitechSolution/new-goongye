import React, { useEffect, useState } from "react";
import "./Home.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Twitter from "./media/twitter.png";
import Telegram from "./media/telegram.png";
import Kakao from "./media/kakao.png";
import Discord from "./media/discord.png";
import Logo from "./media/logo.png";
import Head from "./media/head.png";
import Ape1 from "./media/ape-1.png";
import Ape2 from "./media/ape-2.png";
import Crazy from "./media/crazy-goongye.png";
import King from "./media/king-goongye.png";
import Breed from "./media/breed.png";
import PSSJ from "./media/PSSJ.png";
import Zoe from "./media/Zoe.png";
import Sophia from "./media/Sophia.png";
import Abbey from "./media/Abbey.png";
import NFT1 from "./media/nft-1.png";
import NFT2 from "./media/nft-2.png";
import NFT3 from "./media/nft-3.png";
import NFT4 from "./media/nft-4.png";
import NFT5 from "./media/nft-5.png";
import NFT6 from "./media/nft-6.png";
import Scene1 from "./media/scene-1.png";
import Scene2 from "./media/scene-2.png";
import Scene3 from "./media/scene-3.png";
import Scene4 from "./media/scene-4.png";
import MintImage from "./media/mint-img.png";
import MintSmImage from "./media/mint-sm-img.png";
import Caver from "caver-js";
import { connectionAction } from "./Redux/connection/actions";
import { toast } from "react-toastify";
import { googyeContractAddress, goongyeContractAbi } from "./Utils/Goongye.js";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
const caver = new Caver(window.klaytn);
const Home = () => {
  // const options1 = {
  //   autoplay: true,
  //   autoplayhoverpause: true,
  //   autoplaytimeout: 100,
  //   items: 1,
  //   nav: false,
  //   dots: true,
  //   loop: true,
  // };

  // const options2 = {
  //   autoplay: true,
  //   autoplayhoverpause: true,
  //   autoplaytimeout: 100,
  //   items: 6,
  //   nav: false,
  //   dots: true,
  //   loop: true,
  //   responsive: {
  //     0: {
  //       items: 2,
  //       dots: true,
  //     },
  //     769: {
  //       items: 3,
  //       dots: true,
  //     },
  //     1200: {
  //       items: 4,
  //       dots: true,
  //     },
  //     1300: {
  //       items: 6,
  //       dots: false,
  //     },
  //   },
  // };

  // const options3 = {
  //   autoplay: true,
  //   autoplayhoverpause: true,
  //   autoplaytimeout: 100,
  //   items: 4,
  //   nav: false,
  //   dots: false,
  //   loop: false,
  //   responsive: {
  //     0: {
  //       items: 2,
  //       dots: true,
  //       loop: true,
  //     },
  //     769: {
  //       items: 3,
  //       dots: true,
  //       loop: true,
  //     },
  //     1200: {
  //       items: 4,
  //       dots: false,
  //       loop: false,
  //     },
  //   },
  // };

  let [noMints, setNomints] = useState(1);
  let [ttlKlay, setTtlKlay] = useState(0);
  const dispatch = useDispatch();
  let acc = useSelector((state) => state.connect?.connection);

  console.log("acc", acc);
  const onConnectAccount = () => {
    dispatch(connectionAction());
  };

  const getInitialMintPrice = async () => {
    try {
      let contractOf = new caver.klay.Contract(
        goongyeContractAbi,
        googyeContractAddress
      );
      let totalPrice = await contractOf.methods.gPRice(1).call();
      totalPrice = caver.utils.fromPeb(totalPrice);
      setTtlKlay(totalPrice);
    } catch (e) {
      console.log("Error while getting minting price", e);
    }
  };

  const increment = async () => {
    if (noMints < 3) {
      const web3 = window.web3;
      let contractOf = new caver.klay.Contract(
        goongyeContractAbi,
        googyeContractAddress
      );
      let newNum = noMints + 1;
      let totalPrice = await contractOf.methods.gPRice(newNum).call();
      console.log("totalPrice", totalPrice);

      totalPrice = parseFloat(totalPrice) / 1000000000000000000;
      setTtlKlay(totalPrice);
      setNomints(newNum);
      console.log("Incremetn", totalPrice);
    }
  };
  const decrement = async () => {
    if (noMints > 1) {
      console.log("decremetn");
      const web3 = window.web3;
      let contractOf = new caver.klay.Contract(
        goongyeContractAbi,
        googyeContractAddress
      );
      let newNum = noMints - 1;
      console.log("newNum", newNum);

      let totalPrice = await contractOf.methods.gPRice(newNum).call();
      console.log("totalPrice", totalPrice);

      totalPrice = parseFloat(totalPrice) / 1000000000000000000;
      setTtlKlay(totalPrice);
      console.log("Incremetn", totalPrice);
      setNomints(newNum);
    }
  };

  const mintAndStake = async () => {
    // let myAccountAddress = await loadWeb3();
    console.log("myAccountAddress", acc);
    if (acc == "No Wallet") {
      console.log("No wallet");
      toast.error(acc);
    } else if (acc == "Wrong Network") {
      console.log("Wrong Network");
      toast.error(acc);
    } else if (acc == "Connect Wallet") {
      toast.error(acc);
    } else {
      try {
        const { klaytn } = window;
        let contractOf = new caver.klay.Contract(
          goongyeContractAbi,
          googyeContractAddress
        );

        let totalPrice = await contractOf.methods.gPRice(noMints).call();
        console.log("totalPrice", totalPrice);
        let balance = await caver.klay.getBalance(acc);
        // balance = caver.utils.fromPeb(balance);

        console.log("Balance", balance);
        if (parseFloat(balance) > parseFloat(totalPrice)) {
          await contractOf.methods.mint(noMints).send({
            from: acc,
            value: totalPrice,
            gas: "800000",
          });
          toast.success("Transaction Successfull");
        } else {
          toast.error("insufficient Balance!");
        }
      } catch (e) {
        console.log(" Error while minting", e);
        toast.error("Minting Failed");
      }
    }
  };

  const [sound, setSound] = useState(true);

  useEffect(() => {
    getInitialMintPrice();
  }, [acc]);

  return (
    <div className="home">
      <section id="topbar" className="d-flex align-items-center">
        <div className="container d-flex justify-content-center justify-content-md-between">
          <div className="contact-info d-flex align-items-center"></div>
          <div className="social-links" data-aos="fade-down">
            <a href="/" className="Eng">
              <span className="green">ENG</span>
            </a>{" "}
            /
            <a href="/kr" className="Kor pe-4">
              KOR
            </a>
            <a
              href="https://twitter.com/crazyapegoongye"
              target="_blank"
              rel="noreferrer"
              className="twitter pe-1"
            >
              <img src={Twitter} alt="" />
            </a>
            <a
              href="https://t.me/+5VvQvVvtYIA2OTc9"
              target="_blank"
              rel="noreferrer"
              className="telegram pe-1"
            >
              <img src={Telegram} alt="" />
            </a>
            <a
              href="https://open.kakao.com/o/gzwaZ0be"
              target="_blank"
              rel="noreferrer"
              className="kakao pe-1"
            >
              <img src={Kakao} alt="" />
            </a>
            <a
              href="https://discord.gg/GJB55Rwbfe"
              target="_blank"
              rel="noreferrer"
              className="discord pe-1"
            >
              <img src={Discord} alt="" />
            </a>
          </div>
        </div>
      </section>

      <header id="header" className="d-flex align-items-center">
        <div className="container d-flex align-items-center justify-content-between">
          <a href="/" className="logo">
            <img src={Logo} alt="" data-aos="zoom-in" className="img-fluid" />
          </a>

          <nav id="navbar" className="navbar" data-aos="zoom-in">
            <ul>
              <li>
                <a className="nav-link scrollto" href="#story">
                  Story
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="#tokenomics">
                  Tokenomics
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="#nft">
                  NFT
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="#mint">
                  Mint
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="#stake">
                  Stake
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="#roadmap">
                  Roadmap
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="#team">
                  Team
                </a>
              </li>
              <li>
                <a className="nav-link scrollto" href="#faq">
                  FAQ
                </a>
              </li>
            </ul>
            <i className="bi bi-list mobile-nav-toggle"></i>
          </nav>
        </div>
      </header>
      <section
        id="hero"
        className="d-flex align-items-center"
        data-aos="fade"
        data-aos-delay="0"
      >
        <div className="container position-relative text-center">
          <img
            src={Head}
            className="head-img pb-3 pt-5"
            data-aos="fade-down"
            data-aos-offset="0"
            alt=""
          />
          <h1 data-aos="fade-up" data-aos-offset="0">
            WELCOME TO THE
            <br />
            CRAZY APE GOONGYE CLUB
          </h1>
          <p className="text-light" data-aos="zoom-in" data-aos-offset="0">
            The Goongye, the ruthless founder of the country, has transcended
            humanity and has become a higher being. He has transformed into the
            Crazy Ape Goongye, with knowledge beyond the fathomable concepts of
            man. Through his teachings, the Ape Goongye aims to create a new
            civilization that is efficient and prioritizes reason more than
            emotions.
          </p>
          <h2 data-aos="fade-up" data-aos-offset="0">
            If you want to build this better world, come and join us!
          </h2>
        </div>
      </section>

      <section id="story">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2>Story</h2>
          </div>
          <div className="row pt-5">
            <div className="col-lg-6 img-part">
              <img
                src={Ape1}
                className="w-75 img-1"
                data-aos="fade-up"
                data-aos-delay="400"
                alt=""
              />
              <img
                src={Ape2}
                className="w-75 img-2"
                data-aos="fade-up"
                data-aos-delay="600"
                alt=""
              />
            </div>
            <div className="col-lg-6 pt-4 pt-lg-0">
              <h3
                className="story-heading pb-2"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                BACKGROUND
              </h3>
              <p className="text-light" data-aos="fade-up" data-aos-delay="400">
                When the Goongye was still in his human form, he was a ruthless
                tyrant that led his people to victory. His country overcame war
                against various enemies through the use of deadly force and
                objective decisions. The Goongye showed no mercy to his enemies
                but was a good ally to his friends. He never abandoned a partner
                in battle nor let his worst enemies survive a fight. As he
                gained more knowledge to understand the world and become more
                powerful, he came upon the forbidden book - The Necronomicon.
              </p>
              <p className="text-light" data-aos="fade-up" data-aos-delay="600">
                The Goongye was thirsty for knowledge and power which led him to
                ignore the warnings of his council and read the forbidden book.
                He spent weeks in his room, reading and analyzing each page and
                text. When he emerged from his weeks of seclusion, he was not a
                man anymore. He has become the Ape Goongye; a higher being that
                values reason and objectivity beyond anything else.
              </p>
              <h3
                className="story-heading pb-2"
                data-aos="fade-up"
                data-aos-delay="800"
              >
                STORY
              </h3>
              <p
                className="text-light"
                data-aos="fade-up"
                data-aos-delay="1000"
              >
                While the Ape Goongye has acquired knowledge beyond the
                understanding of man, the world has fallen into a war between
                the Eastern and Western countries. Since the Ape Goongye is from
                the east, he then prepares to help his allies win the war.
              </p>
              <p
                className="text-light"
                data-aos="fade-up"
                data-aos-delay="1000"
              >
                However, reading the Necronomicon has made the Ape Goongye less
                of a tyrant and more of a peace-keeper. While he wants to secure
                the power of his country, he does not want to destroy the
                Western countries or harm innocent civilians.
              </p>
              <p
                className="text-light"
                data-aos="fade-up"
                data-aos-delay="1000"
              >
                Since some of the Goongye’s allies preferred the ruthless
                tyrant, they are having trouble working with the changed Ape
                Goongye.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="scene">
        <div className="container">
          {/* <OwlCarousel className="owl-theme" {...options1}> */}
          <OwlCarousel className="owl-theme">
            <div className="col text-center text-light">
              <div className="d-flex justify-content-center">
                <img src={Scene1} className="img" alt="" />
              </div>
              <div className="scene-text mt-4 d-flex justify-content-space-between">
                <h4>Scene&nbsp;#1</h4>
                <p>
                  The Ape Goongye discusses war tactics with other Eastern
                  countries to minimize casualties and end the conflict.
                  However, some of the allies want the Ape Goongye to use his
                  troops to wipe out an enemy camp.
                </p>
              </div>
            </div>
            <div className="col text-center text-light">
              <div className="d-flex justify-content-center">
                <img src={Scene2} className="img" alt="" />
              </div>
              <div className="scene-text mt-4 d-flex justify-content-space-between">
                <h4>Scene&nbsp;#2</h4>
                <p>
                  The Ape Goongye and some of the allies entered a heated
                  argument regarding violent tactics and securing the safety of
                  civilians.
                </p>
              </div>
            </div>
            <div className="col text-center text-light">
              <div className="d-flex justify-content-center">
                <img src={Scene3} className="img" alt="" />
              </div>
              <div className="scene-text mt-4 d-flex justify-content-space-between">
                <h4>Scene&nbsp;#3</h4>
                <p>
                  The Ape Goongye realizes that his allies want to destroy the
                  Western countries and take over their territory. Since he is
                  not a ruthless tyrant anymore, he decides to leave his
                  position as a leader and left civilization.
                </p>
              </div>
            </div>
            <div className="col text-center text-light">
              <div className="d-flex justify-content-center">
                <img src={Scene4} className="img" alt="" />
              </div>
              <div className="scene-text mt-4 d-flex justify-content-space-between">
                <h4>Scene&nbsp;#4</h4>
                <p>
                  Now, the Ape Goongye travels the world as a stranger that
                  teaches men about peace and the sanctity of life. The Eastern
                  and Western countries are in a constant war but the Ape
                  Goongye decides to ignore the violence.
                </p>
              </div>
            </div>
          </OwlCarousel>
        </div>
      </section>

      <section id="tokenomics">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2 className="text-light">Tokenomics</h2>
          </div>
          <div
            className="row pt-4 top-section"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="col-md-4 img-box pb-4 text-center">
              <img src={Crazy} alt="" className="img pb-4" />
              <h4>Crazy Goongye</h4>
              <p>Stake &amp; Receive</p>
              <p>
                <span className="blue">2,000</span>{" "}
                <span className="green">$MAGUNI</span> per day
              </p>
            </div>
            <div
              className="col-md-4 py-4 d-flex align-items-center justify-content-center"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <img src={Breed} alt="" className="w-50" />
            </div>
            <div
              className="col-md-4 img-box pb-4 text-center"
              data-aos="fade-up"
              data-aos-delay="900"
            >
              <img src={King} alt="" className="img pb-4" />
              <h4>King Goongye</h4>
              <p>Stake &amp; Receive</p>
              <p>
                <span className="blue">10,000</span>{" "}
                <span className="green">$MAGUNI</span> per day
              </p>
            </div>
          </div>
          <div className="row pt-4 text-light desc">
            <p data-aos="fade-up" data-aos-delay="100">
              <span className="green">$MAGUNI</span> is the insane token that
              powers the Crazy Ape Goongye ecosystem. All holders of a Ape
              Goongye can stake and receive <span className="blue">2,000</span>{" "}
              <span className="green">$MAGUNI</span>{" "}
              <span className="blue">tokens</span> per day.
            </p>
            <p data-aos="fade-up" data-aos-delay="200">
              It costs <span className="blue">1,000</span>{" "}
              <span className="green">KLAY</span>{" "}
              <span className="blue">tokens</span> to evolve your Crazy Goongye
              to King Goongye. Once you're a holder of a King Goongye you can
              stake them and will receive <span className="blue">10,000</span>{" "}
              <span className="green">$MAGUNI</span>{" "}
              <span className="blue">tokens</span> per day. Here will only be a
              maximum supply of <span className="blue">2,000</span> King Goongye
              ever minted.
            </p>
            <p data-aos="fade-up" data-aos-delay="300">
              Your original Crazy Goongye gets burned when you mint an King
              Goongye which will lessen the supply of Crazy Ape Goongye in the
              ecosystem.
            </p>
            <p data-aos="fade-up" data-aos-delay="400">
              <span className="green">$MAGUNI</span>{" "}
              <span className="blue">tokens</span> can also be used to change
              the name and bio of your Crazy Goongye or King Goongye. There are
              future utilities coming to the Rec Room such as mini games like
              "Maguni". By participating in these games you will be able to
              receive rewards.
            </p>
            <p data-aos="fade-up" data-aos-delay="500">
              <span className="green">** $MAGUNI</span> is the utility token
              designed and intended solely as a method to obtain goods or
              services available at the Crazy Ape Goongye.{" "}
              <span className="green">$MAGUNI</span>{" "}
              <span className="blue">tokens</span> are not intended to generate
              profit, speculative or otherwise, and is NOT an investment and has
              NO economic value.
            </p>
          </div>
        </div>
      </section>

      <section id="staking">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2>Staking</h2>
          </div>
          <div className="row pt-4 text-light desc">
            <p data-aos="fade-up" data-aos-delay="100">
              After announcing that you can stake your Crazy Ape Goongye we
              received a lot of positive feedback showing that people are very
              interested in this feature. So, how do you stake your Crazy Ape
              Goongye and what benefits does it bring?
            </p>
            <p data-aos="fade-up" data-aos-delay="200">
              The Staking feature will be available immediately upon mint of
              your Crazy Ape Goongye NFT. Owners can stake their Crazy Ape
              Goongye for any period of time depending on their decision and
              will receive a reward of <span className="blue">2,000</span>
              <span className="green"> $MAGUNI</span>{" "}
              <span className="blue">tokens</span> per day.
            </p>
            <p data-aos="fade-up" data-aos-delay="300">
              The more Crazy Ape Goongye you use to stake the more{" "}
              <span className="green">$MAGUNI</span>{" "}
              <span className="blue">tokens</span> you will receive. You can
              also evolve to level up and mint an King Ape Goongye. King Ape
              Goongye NFTs will also be available to stake and owners will
              receive 5 times more rewards, at the rate of{" "}
              <span className="blue">10,000</span>{" "}
              <span className="green">$MAGUNI</span>{" "}
              <span className="blue">tokens</span> per day.
            </p>
          </div>
        </div>
      </section>

      <section id="nft">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2 className="text-light">CRAZY APE GOONGYE NFT</h2>
          </div>

          {/* <OwlCarousel className="owl-theme" {...options2}> */}
          <OwlCarousel className="owl-theme">
            <div className="slide-img p-2">
              <img src={NFT1} alt="" />
            </div>
            <div className="slide-img p-2">
              <img src={NFT2} alt="" />
            </div>
            <div className="slide-img p-2">
              <img src={NFT3} alt="" />
            </div>
            <div className="slide-img p-2">
              <img src={NFT4} alt="" />
            </div>
            <div className="slide-img p-2">
              <img src={NFT5} alt="" />
            </div>
            <div className="slide-img p-2">
              <img src={NFT6} alt="" />
            </div>
          </OwlCarousel>

          <div
            className="cta text-center py-5"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <a href="#opensea" className="btn-nft-cta">
              OPENSEA
            </a>
          </div>
        </div>
      </section>

      <section id="mint">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2>Mint</h2>
          </div>
          <div className="row pt-5">
            <div
              className="col-md-6 px-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="fancy-list p-0">
                <img src={MintImage} alt="" className="img-fluid" />
                <ul className="pt-3">
                  <li>You MUST connect a Wallet to mint NFTs.</li>
                  <li>Transactions will be done via the connected wallet.</li>
                  <li>
                    You MUST have KLAYTN to pay gas fee when it comes to make
                    transactions.
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="col-md-6 mt-4 mt-md-0 px-3"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="mint-form">
                <div className="form-head py-3 px-3">
                  <div className="row">
                    <div className="col-9">
                      <h5 className="m-0">Mint your Ape Goongyes</h5>
                      <span>Enter how many card you'd like to mint here.</span>
                    </div>
                    <div className="col-3 text-center">
                      <img
                        src={MintSmImage}
                        className="mint-sm-img rounded"
                        alt=""
                      />
                    </div>
                  </div>
                </div>

                <div className="form-desc p-3">
                  <p className="m-0">Price Per Card</p>
                  <div className="d-flex justify-content-between">
                    <p className="m-0">
                      <span className="green">0.00</span> Klay Each
                    </p>
                    <p className="m-0">
                      <span className="blue">10,000</span> remaining
                    </p>
                  </div>
                </div>
                <div className="form pt-3 px-3">
                  <div className="input-group p-2">
                    <button
                      className="btn-minus"
                      type="button"
                      id=""
                      onClick={() => increment()}
                    >
                      <i className="bx bx-minus"></i>
                    </button>
                    <input
                      type="text"
                      className="form-control number"
                      placeholder="1"
                    >
                      {noMints}
                    </input>
                    <button
                      className="btn-plus"
                      type="button"
                      id=""
                      onClick={() => decrement()}
                    >
                      <i className="bx bx-plus"></i>
                    </button>
                    <span className="input-group-text form-control">3 max</span>
                  </div>
                  <hr className="my-3" />

                  <div className="total text-white">
                    <span className="text">Total</span>
                    <span className="value">{ttlKlay} KLAY</span>
                  </div>
                  <hr className="my-3" />

                  <div className="form-btn">
                    <a
                      href="#connect"
                      className="form-control btn-connect mb-3"
                      onClick={onConnectAccount}
                    >
                      {acc === "No Wallet"
                        ? "Connect"
                        : acc === "Connect Wallet"
                        ? "Connect"
                        : acc === "Wrong Network"
                        ? acc
                        : acc.substring(0, 4) +
                          "..." +
                          acc.substring(acc.length - 4)}
                    </a>
                    <a
                      href="#mint-stake"
                      className="form-control btn-mint mb-3"
                      onClick={() => mintAndStake()}
                    >
                      Mint &amp; Stake Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="roadmap">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2 className="text-light">Roadmap</h2>
          </div>
          <ul className="per_row">
            <li className="on" data-aos="fade" data-aos-delay="300">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="600"
              >
                <span>
                  5<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>
                  Open the website of the ape,{" "}
                  <span className="blue">‘Goongye’</span>
                </div>
              </div>
            </li>
            <li className="on" data-aos="fade" data-aos-delay="400">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="700"
              >
                <span>
                  10<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>
                  Startfirst to third <span className="blue">pre-sale</span>
                </div>
              </div>
            </li>
            <li className="on" data-aos="fade" data-aos-delay="500">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="800"
              >
                <span>
                  15<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>
                  <span className="blue">A prize draw</span> will be provided
                  when the tickets are sold out for each of the first to third
                  rounds.
                </div>
              </div>
            </li>
            <li className="on" data-aos="fade" data-aos-delay="300">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="600"
              >
                <span>
                  20<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>
                  <span className="blue">Start</span> a YouTube channel, blog,
                  and sending to the press
                </div>
              </div>
            </li>
            <li data-aos="fade" data-aos-delay="400">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="700"
              >
                <span>
                  30<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>
                  Airdrops (of) APE Goongye Printy Transportation Card to{" "}
                  <span className="blue">100 People</span>
                </div>
              </div>
            </li>
            <li className="on" data-aos="fade" data-aos-delay="400">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="800"
              >
                <span>
                  40<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>
                  <span className="blue">Tokenomics</span> will be released
                  after the 3rd pre-sale is completed
                </div>
              </div>
            </li>
            <li data-aos="fade" data-aos-delay="300">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="600"
              >
                <span>
                  45<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>
                  Open <span className="blue">minting and staking</span>{" "}
                  function (or Open the function of minting and staking)
                </div>
              </div>
            </li>
            <li className="on" data-aos="fade" data-aos-delay="400">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="700"
              >
                <span>
                  50<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>
                  Purchase the <span className="blue">land of Sandbox</span> and
                  Decentraland metaverse
                </div>
              </div>
            </li>
            <li data-aos="fade" data-aos-delay="500">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="800"
              >
                <span>
                  60<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>
                  <span className="blue">Advertise on the billboard</span> of
                  Yeongdeungpo Times Square
                </div>
              </div>
            </li>
            <li className="on" data-aos="fade" data-aos-delay="300">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="600"
              >
                <span>
                  70<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>
                  Produce a logo song for{" "}
                  <span className="blue">Goongye APE</span> (or Make a logo song
                  for Goongye APE)
                </div>
              </div>
            </li>
            <li data-aos="fade" data-aos-delay="400">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="700"
              >
                <span>
                  75<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>
                  Add <span className="blue">governance function</span> to the
                  website
                </div>
              </div>
            </li>
            <li data-aos="fade" data-aos-delay="500">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="800"
              >
                <span>
                  80<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>
                  We conduct{" "}
                  <span className="blue">AMA on social networking</span>{" "}
                  services such as YouTube, Telegram, and Kakao Talk.
                </div>
              </div>
            </li>
            <li className="on" data-aos="fade" data-aos-delay="300">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="600"
              >
                <span>
                  85<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>
                  Open <span className="blue">‘Maguni Game’</span>
                </div>
              </div>
            </li>
            <li data-aos="fade" data-aos-delay="400">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="700"
              >
                <span>
                  90<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>
                  Issue <span className="blue">3D NFT</span> to benefit holders
                  (chain undecided)
                </div>
              </div>
            </li>
            <li data-aos="fade" data-aos-delay="500">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="800"
              >
                <span>
                  95<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>
                  Hold an offline membership event for{" "}
                  <span className="blue">APE Goongye Club</span> at the end of
                  the year
                </div>
              </div>
            </li>
            <li className="on last" data-aos="fade" data-aos-delay="300">
              <p
                className="per aos-init"
                data-aos="flip-left"
                data-aos-delay="500"
              >
                <span>
                  100<small>%</small>
                </span>
              </p>
              <div className="box">
                <div>Unveil a larger ecosystem expansion (Roadmap 2.0)</div>
              </div>
            </li>
          </ul>

          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="pt-3 text-center text-light"
          >
            *Roadmap schedule is subject to change depending on business
            direction and strategy
          </div>
        </div>
      </section>

      <section id="team">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2>The Team</h2>
          </div>

          {/* <OwlCarousel className="owl-theme" {...options3}> */}
          <OwlCarousel className="owl-theme">
            <div
              className="team-info p-2"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <img src={PSSJ} alt="" />
              <h4 className="name pt-3" c>
                #PSS J
              </h4>
              <span className="pos">The Artist</span>
            </div>
            <div
              className="team-info p-2"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <img src={Zoe} alt="" />
              <h4 className="name pt-3" c>
                #Zoe
              </h4>
              <span className="pos">Blockchain Dev</span>
            </div>
            <div
              className="team-info p-2"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <img src={Sophia} alt="" />
              <h4 className="name pt-3" c>
                #Sophia
              </h4>
              <span className="pos">Web Design</span>
            </div>
            <div
              className="team-info p-2"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <img src={Abbey} alt="" />
              <h4 className="name pt-3" c>
                #Abbey
              </h4>
              <span className="pos">Community</span>
            </div>
          </OwlCarousel>
        </div>
      </section>

      <section id="faq">
        <div className="container">
          <div
            className="section-title"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h2 className="text-light">FAQ</h2>
          </div>
          <div className="row pt-4">
            <div className="accordion accordion-flush text-light" id="faqs">
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingOne">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded="false"
                    aria-controls="flush-collapseOne"
                  >
                    <h3 className="pe-3">Q.</h3>When will the minting site be
                    announced?
                  </button>
                </span>
                <div
                  id="flush-collapseOne"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingOne"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">A.</h3>
                    <p>It will be released on the day of minting.</p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseTwo"
                    aria-expanded="false"
                    aria-controls="flush-collapseTwo"
                  >
                    <h3 className="pe-3">Q.</h3>What is the total issuance and
                    minting quantity?
                  </button>
                </span>
                <div
                  id="flush-collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingTwo"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">A.</h3>
                    <p>
                      The total issuance is 10,000 units, and 9,800 units will
                      be minted excluding 200 units of the team.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingThree">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseThree"
                    aria-expanded="false"
                    aria-controls="flush-collapseThree"
                  >
                    <h3 className="pe-3">Q.</h3> What is the minting price, and
                    how many mints are available per transaction?
                  </button>
                </span>
                <div
                  id="flush-collapseThree"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingOne"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">A.</h3>
                    <p>
                      1st Minting: 110KLAY (3 per transaction)
                      <br />
                      2nd minting: 120KLAY (3 per transaction)
                      <br />
                      3rd minting: 150 KLAY (3 per transaction)
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingFour">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseFour"
                    aria-expanded="false"
                    aria-controls="flush-collapseFour"
                  >
                    <h3 className="pe-3">Q.</h3>How can we do minting?
                  </button>
                </span>
                <div
                  id="flush-collapseFour"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingFour"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">A.</h3>
                    <p>
                      It supports Kaikas on its own on its website so that you
                      can mint it.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingFive">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseFive"
                    aria-expanded="false"
                    aria-controls="flush-collapseFive"
                  >
                    <h3 className="pe-3">Q.</h3>Do you have NFT secondary
                    royalty?
                  </button>
                </span>
                <div
                  id="flush-collapseFive"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingFive"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">A.</h3>
                    <p>
                      The secondary royalty has been set at 5%. It will be
                      actively invested to expand the ecosystem and increase the
                      value of the $MAGUNI token, not just for the team's
                      benefit.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingSix">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseSix"
                    aria-expanded="false"
                    aria-controls="flush-collapseSix"
                  >
                    <h3 className="pe-3">Q.</h3>What are the Crazy Ape Goongye?
                  </button>
                </span>
                <div
                  id="flush-collapseSix"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingSix"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">A.</h3>
                    <p>
                      Crazy Ape Goongye is a collection of 10,000 unique NFTs on
                      the Klaytn Blockchain.
                      <br />
                      Each one is individually insane and has their own strange
                      and weird set of traits.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingSeven">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseSeven"
                    aria-expanded="false"
                    aria-controls="flush-collapseSeven"
                  >
                    <h3 className="pe-3">Q.</h3>How many NFT’s will be minted?
                  </button>
                </span>
                <div
                  id="flush-collapseSeven"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingSeven"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">A.</h3>
                    <p>
                      There will only be 10,000 Crazy Ape minted in total, with
                      200 for promotional and management purposes.
                      <br />
                      For King Goongye, there will only be 2,000 minted.
                      <br />
                      You can only mint an King Goongye by evolving your Crazy
                      Goongye for 1,000 KLAY tokens
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingEight">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseEight"
                    aria-expanded="false"
                    aria-controls="flush-collapseEight"
                  >
                    <h3 className="pe-3">Q.</h3>Is it hosted on IPFS?
                  </button>
                </span>
                <div
                  id="flush-collapseEight"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingEight"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">A.</h3>
                    <p>
                      Yes of course, we haven't completely lost our minds. Both
                      the image & metadata will be stored on IPFS. A major
                      concern for NFTs is the integrity of the asset. this
                      includes both the asset itself and any data associated
                      with it. IPFS protects the integrity of NFT data by using
                      CIDs to validate that nothing has changed since the link
                      was created.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingNine">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseNine"
                    aria-expanded="false"
                    aria-controls="flush-collapseNine"
                  >
                    <h3 className="pe-3">Q.</h3>Is there a whitelist and
                    pre-sale for the Crazy Ape Goongye?
                  </button>
                </span>
                <div
                  id="flush-collapseNine"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingNine"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">A.</h3>
                    <p>
                      Join our Discord and follow us on Twitter for whitelist
                      info.{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingTen">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseTen"
                    aria-expanded="false"
                    aria-controls="flush-collapseTen"
                  >
                    <h3 className="pe-3">Q.</h3>Will there be other characters
                    in the future?
                  </button>
                </span>
                <div
                  id="flush-collapseTen"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingTen"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">A.</h3>
                    <p>
                      Yes holders of a Crazy Ape Goongye will be able to mint an
                      King Goongye, limited to 2,000.
                      <br />
                      We will evaluate additional characters and companions with
                      input from the community for future drops.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingEleven">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseEleven"
                    aria-expanded="false"
                    aria-controls="flush-collapseEleven"
                  >
                    <h3 className="pe-3">Q.</h3>Are there any plans to develop
                    Crazy King Goongye Games?
                  </button>
                </span>
                <div
                  id="flush-collapseEleven"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingEleven"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">A.</h3>
                    <p>
                      Yes, to provide additional utility to $MAGUNI token
                      holders we plan on launching a series of mini games for
                      rewards.
                      <br />
                      However we have no plans to launch a huge MetaVerse game,
                      as the brains of the Crazy Ape Goongye are almost
                      impossible to analyze.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-item"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span className="accordion-header" id="flush-headingTwelve">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseTwelve"
                    aria-expanded="false"
                    aria-controls="flush-collapseTwelve"
                  >
                    <h3 className="pe-3">Q.</h3>Why are the team members not
                    public?
                  </button>
                </span>
                <div
                  id="flush-collapseTwelve"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingTwelve"
                  data-bs-parent="#faqs"
                >
                  <div className="accordion-body d-flex flex-row align-items-baseline">
                    <h3 className="pe-3">A.</h3>
                    <p>
                      We value our privacy as do many in the crypto space
                      however we will share all the smart contracts addresses
                      before the sale of any NFTs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="footer"
        data-aos="fade-down"
        data-aos-delay="100"
        data-aos-offset="0"
      >
        <div className="container">
          <div className="row">
            <div className="col-md-3 text-center">
              <a href="/" className="logo">
                <img src={Logo} alt="" className="img-fluid" />
              </a>
            </div>
            <div className="col-md-6 py-3 py-md-0 text-center">
              <p className="m-0">
                <a href="mailto:maguni@crazyapegongyeclub.com">
                  maguni@crazyapegongyeclub.com
                </a>
              </p>
              <p className="m-0">
                &copy; COPYRIGHT Crazyapegoongyeclub. ALL RIGHTS RESERVED
              </p>
            </div>
            <div className="col-md-3 social">
              <a
                href="https://twitter.com/crazyapegoongye"
                target="_blank"
                rel="noreferrer"
                className="twitter"
              >
                <img src={Twitter} alt="" />
              </a>
              <a
                href="https://t.me/+5VvQvVvtYIA2OTc9"
                target="_blank"
                rel="noreferrer"
                className="telegram"
              >
                <img src={Telegram} alt="" />
              </a>
              <a
                href="https://open.kakao.com/o/gzwaZ0be"
                target="_blank"
                rel="noreferrer"
                className="kakao"
              >
                <img src={Kakao} alt="" />
              </a>
              <a
                href="https://discord.gg/GJB55Rwbfe"
                target="_blank"
                rel="noreferrer"
                className="discord"
              >
                <img src={Discord} alt="" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <a
        href="#top"
        className="back-to-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </div>
  );
};

export default Home;
