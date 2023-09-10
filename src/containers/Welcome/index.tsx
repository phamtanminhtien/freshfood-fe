import { SearchOutlined } from "@ant-design/icons";
import { Avatar, QRCode } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import AndroidIcon from "../../assets/android.png";
import iOSIcon from "../../assets/ios.png";

const contributors = [
  {
    name: "Doan Khiet Thanh",
    avatarUrl:
      "https://avatars.githubusercontent.com/u/81890086?s=400&u=71d23d30e17aa0c49bb5c0bbe82eba5e019b7cc6&v=4",
    githubUsername: "doankhietthanh",
  },
  {
    name: "Pham Tan Minh Tien",
    avatarUrl: "https://avatars.githubusercontent.com/u/55906231?v=4",
    githubUsername: "phamtanminhtien",
  },
  // Add more contributors...
];

function Welcome() {
  // const [products, setProducts] = React.useState<ProductStruct[]>([]);
  const [productsSearch, setProductsSearch] = React.useState("");

  const handlerSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductsSearch(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-start relative min-h-[calc(100vh-60px)]">
      <div className="flex-1 py-5 bg-gradient-to-r from-green-300 to-green-600">
        <div className="mt-10 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold text-center text-white ">
            Welcome to{" "}
          </h2>
          <h1 className="text-5xl font-bold text-center text-white mb-10">
            Fresh Food 🥬
          </h1>

          <p className="text-xl text-center text-white w-[50%] mb-10">
            Our innovative platform ensures
            <span className="mx-2 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-cyan-500 relative inline-block">
              <span className="relative text-white">transparency</span>
            </span>
            ,
            <span className="mx-2 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-orange-500 relative inline-block">
              <span className="relative text-white">traceability</span>,
            </span>
            and
            <span className="mx-2 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500 relative inline-block">
              <span className="relative text-white">trust</span>
            </span>
            throughout the entire food supply chain. From farm to fork, we
            provide a secure and reliable solution that benefits consumers,
            producers, and all stakeholders involved.
          </p>
          <div className="flex gap-5 ">
            <Link to="product" className="text-center text-gray-600">
              <button className="bg-white text-xl text-green-500 hover:bg-green-200 hover:text-slate-900 font-bold py-4 px-8 rounded-xl">
                View Products
              </button>
            </Link>
            <Link to="device" className="text-center text-gray-600">
              <button className="bg-blue-500 text-xl text-white hover:bg-green-200 hover:text-slate-900 font-bold py-4 px-8 rounded-xl">
                Add Device
              </button>
            </Link>
          </div>
          <div className="w-[40%] h-[50px] mt-10 ">
            <label className="relative block">
              <span className="sr-only">Search</span>
              <span className="absolute inset-y-0 left-0 flex items-center pl-5">
                <SearchOutlined
                  onClick={() => {
                    window.location.replace(
                      `/tracking/${productsSearch.toString()}`
                    );
                  }}
                />
              </span>
              <input
                className="h-[50px] placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-3xl py-2 pl-16 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                placeholder="Search any product by ID..."
                type="text"
                name="search"
                onChange={handlerSearchChange}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    window.location.replace(
                      `/tracking/${productsSearch.toString()}`
                    );
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-around mb-2">
        <div>
          <h3 className="text-md font-bold mb-4 text-center">
            Scan QR to download app
          </h3>
          <div className="flex gap-10">
            <QRCode
              errorLevel="H"
              size={128}
              value="https://play.google.com/store/apps"
              icon={AndroidIcon}
            />
            <QRCode
              errorLevel="H"
              size={128}
              value="https://www.apple.com/vn/app-store/"
              icon={iOSIcon}
            />
          </div>
        </div>
        <div>
          <h1 className="text-md font-bold mb-4 text-center">Contributors</h1>
          <div className="avatar-container flex justify-center items-center gap-10 mb-5">
            {contributors.map((contributor, index) => (
              <div className="flex flex-col justify-center items-center">
                <a
                  key={index}
                  href={`https://github.com/${contributor.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Avatar
                    key={index}
                    size={48}
                    src={contributor.avatarUrl}
                    alt={contributor.name}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
