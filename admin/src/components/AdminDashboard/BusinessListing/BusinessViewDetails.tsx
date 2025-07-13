import { CiLocationOn } from "react-icons/ci";
import { FaCheckSquare } from "react-icons/fa";
import { FaAngleDown, FaShopify } from "react-icons/fa6";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuArrowDownToLine } from "react-icons/lu";
import RevenueChart from "./revenue-chart";

const files = [
  { name: "Example.pdf", size: "54 mB" },
  { name: "Example(1).pdf", size: "54 mB" },
];

export default function BusinessViewDetails() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-green-100 p-2 rounded-md">
          <FaShopify className="text-2xl text-[#39CF10]" />
        </div>
        <h1 className="text-lg font-semibold">Shopify App startup</h1>
        <span className="flex items-center gap-1 text-gray-600 text-xs px-2 py-1 rounded">
          <CiLocationOn /> Romona
        </span>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-2">
          Instant Digital Product Delivery for Shopify Merchants
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          A simple, efficient solution that enables sellers to launch and manage
          digital product sales in minutes, offering seamless delivery and full
          control over the customer experience.
        </p>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <FaCheckSquare className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              <span className="font-medium">Sell Any Digital Format</span> –
              Supports PDF, PNG, MP4, MOV, GIF, ZIP, JPG, and more
            </p>
          </div>
          <div className="flex items-start gap-2">
            <FaCheckSquare className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              <span className="font-medium">Instant Delivery</span> – Shoppers
              receive files via email and a dedicated download page immediately
              after purchase
            </p>
          </div>
          <div className="flex items-start gap-2">
            <FaCheckSquare className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              <span className="font-medium">
                Unlimited Products and Downloads
              </span>{" "}
              – No limits on product listings, orders, or download access
            </p>
          </div>
          <div className="flex items-start gap-2">
            <FaCheckSquare className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              <span className="font-medium">Access Control Options</span> – Set
              limits on download counts and time-based access for added
              protection
            </p>
          </div>
          <div className="flex items-start gap-2">
            <FaCheckSquare className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              <span className="font-medium">
                Customizable Customer Experience
              </span>{" "}
              – Personalize download emails, thank you pages, and order status
            </p>
          </div>
        </div>

        <button className="text-sm font-bold text-[#464154] mt-2 flex items-center gap-2 cursor-pointer">
          See more <FaAngleDown />
        </button>
      </div>

      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-1">ASKING PRICE</p>
        <p className="text-xl font-semibold">$20.8k</p>
      </div>

      <div className="mb-8">
        <p className="text-xs text-gray-500 mb-1">ASKING PRICE REASONING</p>
        <p className="text-sm text-gray-700 mb-2">
          The $21,000 valuation reflects the full development and testing costs
          we invested to build this app and validate it with the first 100
          merchants. Since it has zero revenue today, this price simply recovers
          our upfr...
        </p>
        <button className="text-sm font-bold text-[#464154] mt-2 flex items-center gap-2 cursor-pointer">
          See more <FaAngleDown />
        </button>
      </div>

      <div className="mb-8">
        <RevenueChart />
      </div>
      <div className="p-6">
        <h2 className="text-[#1A1A3B] text-lg font-semibold mb-4">
          Business Documents
        </h2>
        <div className="flex gap-4 flex-wrap">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center border border-red-600 rounded-lg overflow-hidden w-64"
            >
              <div className="bg-red-600 text-white p-4">
                <IoDocumentTextOutline size={24} />
              </div>
              <div className="flex-1 px-3 py-2">
                <p className="text-sm text-black font-medium">{file.name}</p>
                <p className="text-xs text-gray-600">{file.size}</p>
              </div>
              <div className="text-red-600 px-4">
                <LuArrowDownToLine size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <button className="bg-[#002C69]  text-white px-6 py-2 rounded-md cursor-pointer">
          Approve
        </button>
        <button className="bg-[#E6F0F8] text-[#002C69] border-[#002C69] border px-6 py-2 rounded-md cursor-pointer">
          Reject
        </button>
      </div>
    </div>
  );
}

