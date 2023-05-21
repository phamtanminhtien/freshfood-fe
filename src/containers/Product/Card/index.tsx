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
            <div className="text-lg font-bold">
              #{props.data.productId.toString()} {props.data.name.toString()}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {props.data.origin.toString()}
          </div>
        </div>
        <div className="bg-gray-200 text-green-600 rounded-full px-2 py-1 text-sm">
          30 ngày
        </div>
      </div>
    </div>
  );
}
