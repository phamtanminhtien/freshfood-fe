import { Link } from "react-router-dom";
import { ProductStruct } from "../../../types/contracts/FreshFood";

type Props = {
  data: ProductStruct;
  handleSelect: (id: string) => void;
};

export function Card(props: Props) {
  return (
    <div
      className="bg-white p-3 rounded-2xl shadow-lg cursor-pointer"
      onClick={() => props.handleSelect(props.data.productId.toString())}
    >
      <img
        src={props.data.image.toString()}
        className="h-32 w-full object-cover rounded-2xl"
      />
      <div className="flex justify-between items-center mt-2">
        <div className="">
          <div className="flex gap-2">
            <div className="text-lg font-bold flex items-center gap-2">
              #{props.data.productId.toString()} {props.data.name.toString()}
              {props.data.verified && (
                <span className="text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {props.data.origin.toString()}
          </div>
        </div>
        {/* <div className="bg-gray-200 text-green-600 rounded-full px-2 py-1 text-sm">
          30 ngày
        </div> */}
      </div>
    </div>
  );
}
