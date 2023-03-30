import { ProductStruct } from "../../../types/contracts/FreshFood";

export function Card(props: { data: ProductStruct }) {
  return (
    <div className="bg-white p-3 rounded-2xl shadow-lg">
      <img
        src="https://cdn.mos.cms.futurecdn.net/sKbruCKdeZpKnNpcwf35fc-1200-80.jpg"
        className="h-32 w-full object-cover rounded-2xl"
      />
      <div className="flex justify-between items-center mt-2">
        <div className="">
          <div className="text-lg font-bold">{props.data.name.toString()}</div>
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
