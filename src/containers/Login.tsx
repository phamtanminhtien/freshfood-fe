import { notification } from "antd";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";
import { setEthState } from "../stores/eth/ethSlice";
import { useDispatch } from "react-redux";
import { ethers, providers } from "ethers";

function Login() {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const providers = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await providers.send("eth_requestAccounts", []);

        dispatch(
          setEthState({
            account: accounts[0],
          })
        );
        localStorage.setItem("account", accounts[0]);
        history.push("/v1/home");
      } catch (error) {
        console.log(error);
        notification.error({
          message: "Error",
          description: "Please connect your wallet",
        });
      }
    } else {
      notification.error({
        message: "Error",
        description: "Please install Metamask",
      });
    }
  };

  return (
    <div className="bg-[#4ABF78] h-screen flex justify-center items-center relative overflow-hidden">
      <div className="-z-0 absolute w-80 h-80 rounded-full bg-[#5AC583] top-0 right-0 translate-x-[20%] -translate-y-[20%]"></div>
      <div className="-z-0 absolute w-80 h-80 rounded-full bg-[#5AC583] bottom-0 left-0 translate-x-[20%] -translate-y-[20%]"></div>
      <div className="z-10 relative flex flex-col gap-20">
        <motion.h1
          initial={{ opacity: 0, x: -200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.5,
          }}
          className="text-5xl font-bold text-white"
        >
          Connect your Wallet
        </motion.h1>
        <motion.div
          initial={{ rotate: 180, opacity: 0.5, scale: 9 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.5,
          }}
          className="flex justify-between"
        >
          <motion.div
            whileHover={{ scale: 1.2, rotate: 360 }}
            whileTap={{
              scale: 0.8,
              rotate: 270,
              borderRadius: "100%",
            }}
            className="bg-white p-5 rounded-lg cursor-pointer select-none"
            onClick={handleConnectWallet}
          >
            <svg
              width="82"
              height="77"
              viewBox="0 0 82 77"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1_31)">
                <path
                  d="M80.0993 0L44.9138 26.0771L51.4568 10.709L80.0993 0Z"
                  fill="#E17726"
                />
                <path
                  d="M1.98294 0.0306473L30.5487 10.7109L36.7616 26.2805L1.98294 0.0306473Z"
                  fill="#E27625"
                />
                <path
                  d="M65.9395 55.4586L81.4909 55.7551L76.056 74.2486L57.0798 69.0153L65.9395 55.4586Z"
                  fill="#E27625"
                />
                <path
                  d="M16.0602 55.4586L24.8871 69.0154L5.94277 74.249L0.540833 55.7551L16.0602 55.4586Z"
                  fill="#E27625"
                />
                <path
                  d="M35.9169 22.3145L36.5526 42.8746L17.5353 42.008L22.9446 33.8339L23.0131 33.7551L35.9169 22.3145Z"
                  fill="#E27625"
                />
                <path
                  d="M45.8861 22.0852L58.9868 33.756L59.0546 33.8342L64.464 42.0082L45.4512 42.8746L45.8861 22.0852Z"
                  fill="#E27625"
                />
                <path
                  d="M25.4439 55.5183L35.828 63.6221L23.7656 69.4554L25.4439 55.5183Z"
                  fill="#E27625"
                />
                <path
                  d="M56.5578 55.517L58.2013 69.4555L46.1729 63.6216L56.5578 55.517Z"
                  fill="#E27625"
                />
                <path
                  d="M46.4382 62.8582L58.6444 68.7782L47.2902 74.1832L47.4081 70.6108L46.4382 62.8582Z"
                  fill="#D5BFB2"
                />
                <path
                  d="M35.5583 62.8609L34.6264 70.5524L34.7029 74.179L23.3221 68.7782L35.5583 62.8609Z"
                  fill="#D5BFB2"
                />
                <path
                  d="M32.0335 45.558L35.2232 52.2724L24.3635 49.086L32.0335 45.558Z"
                  fill="#233447"
                />
                <path
                  d="M49.9661 45.5586L57.6722 49.0858L46.7772 52.2713L49.9661 45.5586Z"
                  fill="#233447"
                />
                <path
                  d="M26.2741 55.4498L24.5186 69.9L15.1101 55.7656L26.2741 55.4498Z"
                  fill="#CC6228"
                />
                <path
                  d="M55.7267 55.4498L66.891 55.7657L57.4471 69.9004L55.7267 55.4498Z"
                  fill="#CC6228"
                />
                <path
                  d="M64.7391 41.1909L56.6142 49.4848L50.35 46.6175L47.3508 52.9328L45.3846 42.0729L64.7391 41.1909Z"
                  fill="#CC6228"
                />
                <path
                  d="M17.257 41.1908L36.6148 42.0729L34.6486 52.9328L31.6488 46.6183L25.4176 49.485L17.257 41.1908Z"
                  fill="#CC6228"
                />
                <path
                  d="M16.7093 39.489L25.9017 48.8319L26.2203 58.0555L16.7093 39.489Z"
                  fill="#E27525"
                />
                <path
                  d="M65.3 39.4721L55.772 58.0718L56.1307 48.8317L65.3 39.4721Z"
                  fill="#E27525"
                />
                <path
                  d="M36.1654 40.0579L36.5354 42.3903L37.4496 48.2009L36.8619 66.0474L34.0831 51.7111L34.0822 51.5629L36.1654 40.0579Z"
                  fill="#E27525"
                />
                <path
                  d="M45.8297 40.0257L47.9184 51.5629L47.9175 51.7111L45.1318 66.0832L45.0216 62.4884L44.5869 48.0952L45.8297 40.0257Z"
                  fill="#E27525"
                />
                <path
                  d="M56.9479 48.4606L56.6368 56.4743L46.9397 64.0419L44.9793 62.6546L47.1767 51.3178L56.9479 48.4606Z"
                  fill="#F5841F"
                />
                <path
                  d="M25.0858 48.4607L34.8232 51.3181L37.0206 62.6546L35.0602 64.0419L25.3626 56.4737L25.0858 48.4607Z"
                  fill="#F5841F"
                />
                <path
                  d="M21.4667 67.0085L33.8731 72.8964L33.8206 70.3821L34.8586 69.4695H47.1374L48.213 70.3791L48.1338 72.8916L60.4615 67.0234L54.4628 71.9884L47.2091 76.9786H34.7592L27.5102 71.968L21.4667 67.0085Z"
                  fill="#C0AC9D"
                />
                <path
                  d="M45.5496 62.0746L47.3037 63.3157L48.3316 71.5306L46.844 70.2724H35.1605L33.7012 71.5559L34.6954 63.3164L36.4501 62.0746H45.5496Z"
                  fill="#161616"
                />
                <path
                  d="M77.7764 0.721807L82 13.4132L79.3623 26.2454L81.2405 27.6967L78.699 29.639L80.609 31.1165L78.0797 33.4239L79.6326 34.5502L75.5115 39.371L58.6087 34.4416L58.4622 34.3629L46.2816 24.0711L77.7764 0.721807Z"
                  fill="#763E1A"
                />
                <path
                  d="M4.22364 0.721806L35.7185 24.0711L23.538 34.3629L23.3915 34.4416L6.48849 39.371L2.3675 34.5502L3.91911 33.4247L1.39096 31.1165L3.29747 29.6406L0.717928 27.6928L2.66702 26.2405L0 13.4136L4.22364 0.721806Z"
                  fill="#763E1A"
                />
                <path
                  d="M57.7817 33.3636L75.6914 38.5864L81.51 56.5484L66.1594 56.5484L55.5824 56.682L63.2744 41.6645L57.7817 33.3636Z"
                  fill="#F5841F"
                />
                <path
                  d="M24.2182 33.3636L18.7244 41.6645L26.4175 56.682L15.8457 56.5484H0.522278L6.3082 38.5865L24.2182 33.3636Z"
                  fill="#F5841F"
                />
                <path
                  d="M52.3339 10.6234L47.3245 24.175L46.2614 42.482L45.8546 48.22L45.8224 62.878H36.1773L36.146 48.2475L35.7379 42.4769L34.6744 24.175L29.6658 10.6234H52.3339Z"
                  fill="#F5841F"
                />
              </g>
              <defs>
                <clipPath id="clip0_1_31">
                  <rect width="82" height="77" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2, rotate: 360 }}
            whileTap={{
              scale: 0.8,
              rotate: 270,
              borderRadius: "100%",
            }}
            className="bg-white p-5 rounded-lg cursor-pointer select-none"
          >
            <svg
              width="82"
              height="82"
              viewBox="0 0 82 82"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M41 0C63.6461 0 82 18.3539 82 41C82 63.6461 63.6461 82 41 82C18.3539 82 0 63.6461 0 41C0 18.3539 18.3539 0 41 0Z"
                fill="url(#paint0_radial_1_103)"
              />
              <path
                d="M26.0574 31.6629C34.3055 23.607 47.6945 23.607 55.9426 31.6629L56.9356 32.6398C57.352 33.0402 57.352 33.6969 56.9356 34.0973L53.5402 37.4125C53.332 37.6207 52.9957 37.6207 52.7875 37.4125L51.4262 36.0832C45.6606 30.4617 36.3395 30.4617 30.5738 36.0832L29.1164 37.5086C28.9082 37.7168 28.5719 37.7168 28.3637 37.5086L24.9684 34.1934C24.552 33.793 24.552 33.1363 24.9684 32.7359L26.0574 31.6629ZM62.9735 38.5176L66.0004 41.4645C66.4168 41.8648 66.4168 42.5215 66.0004 42.9219L52.3711 56.2309C51.9547 56.6313 51.282 56.6313 50.8817 56.2309L41.2082 46.7816C41.1121 46.6855 40.9359 46.6855 40.8399 46.7816L31.1664 56.2309C30.75 56.6313 30.0774 56.6313 29.677 56.2309L15.9996 42.9219C15.5832 42.5215 15.5832 41.8648 15.9996 41.4645L19.0266 38.5176C19.443 38.1172 20.1156 38.1172 20.516 38.5176L30.1895 47.9668C30.2856 48.0629 30.4617 48.0629 30.5578 47.9668L40.2313 38.5176C40.6477 38.1172 41.3203 38.1172 41.7207 38.5176L51.3942 47.9668C51.4902 48.0629 51.6664 48.0629 51.7625 47.9668L61.4359 38.5176C61.8844 38.1172 62.557 38.1172 62.9735 38.5176Z"
                fill="white"
              />
              <defs>
                <radialGradient
                  id="paint0_radial_1_103"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(0.000254154 41.0013) scale(82)"
                >
                  <stop stopColor="#5D9DF6" />
                  <stop offset="1" stopColor="#006FFF" />
                </radialGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
